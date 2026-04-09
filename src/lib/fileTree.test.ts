import {
  CORE_EXPLORER_ROOT_NAME,
  TreeNodeType,
  validateTreeJson,
  wrapAsCoreExplorerRoot,
  type FolderNode,
  type TreeNode,
} from './fileTree'

/** Deep tree: mixed folders/files, empty folder, size 0, dotted names, unicode. */
const complexValidSingleRoot = {
  name: 'repo',
  type: TreeNodeType.Folder,
  children: [
    {
      name: '.github',
      type: TreeNodeType.Folder,
      children: [
        {
          name: 'workflows',
          type: TreeNodeType.Folder,
          children: [
            { name: 'ci.yml', type: TreeNodeType.File, size: 0 },
            { name: 'release.yml', type: TreeNodeType.File, size: 4096 },
          ],
        },
        { name: 'CODEOWNERS', type: TreeNodeType.File, size: 120 },
      ],
    },
    {
      name: 'src',
      type: TreeNodeType.Folder,
      children: [
        {
          name: 'lib',
          type: TreeNodeType.Folder,
          children: [
            {
              name: 'nested',
              type: TreeNodeType.Folder,
              children: [
                { name: 'deep.ts', type: TreeNodeType.File, size: 1 },
                { name: 'README.md', type: TreeNodeType.File, size: 999_999 },
              ],
            },
          ],
        },
        { name: 'app.tsx', type: TreeNodeType.File, size: 2048 },
        {
          name: 'empty-dir',
          type: TreeNodeType.Folder,
          children: [],
        },
      ],
    },
    { name: '包.txt', type: TreeNodeType.File, size: 42 },
    { name: 'weird.name.min.js', type: TreeNodeType.File, size: 3 },
  ],
}

const complexValidMultiRoot = [
  {
    name: 'frontend',
    type: TreeNodeType.Folder,
    children: [{ name: 'index.html', type: TreeNodeType.File, size: 512 }],
  },
  {
    name: 'backend',
    type: TreeNodeType.Folder,
    children: [
      {
        name: 'api',
        type: TreeNodeType.Folder,
        children: [{ name: 'server.ts', type: TreeNodeType.File, size: 10_240 }],
      },
    ],
  },
  { name: 'LICENSE', type: TreeNodeType.File, size: 0 },
]

function expectFail(value: unknown, substring?: string) {
  const result = validateTreeJson(value)
  expect(result.ok).toBe(false)
  if (!result.ok && substring) {
    expect(result.error).toContain(substring)
  }
}

function expectOkWrapped(value: unknown): FolderNode {
  const result = validateTreeJson(value)
  expect(result.ok).toBe(true)
  if (!result.ok) {
    throw new Error(result.error)
  }
  if (result.data.type !== TreeNodeType.Folder) {
    throw new Error('Expected wrapped core root to be a folder')
  }
  return result.data
}

describe('validateTreeJson', () => {
  describe('successful imports (wrapped under workspace)', () => {
    it('accepts a complex single root and wraps with core explorer root', () => {
      const data = expectOkWrapped(complexValidSingleRoot)
      expect(data.name).toBe(CORE_EXPLORER_ROOT_NAME)
      expect(data.type).toBe(TreeNodeType.Folder)
      expect(data.children).toHaveLength(1)
      expect(data.children[0]).toEqual(complexValidSingleRoot)
    })

    it('accepts multiple top-level roots and wraps as siblings under workspace', () => {
      const data = expectOkWrapped(complexValidMultiRoot)
      expect(data.name).toBe(CORE_EXPLORER_ROOT_NAME)
      expect(data.children).toHaveLength(3)
      expect(data.children.map((c) => c.name)).toEqual(['frontend', 'backend', 'LICENSE'])
    })

    it('accepts a minimal valid folder (empty children)', () => {
      const minimal = {
        name: 'only',
        type: TreeNodeType.Folder,
        children: [],
      }
      const data = expectOkWrapped(minimal)
      expect(data.children[0]).toEqual(minimal)
    })

    it('accepts a minimal valid file', () => {
      const file = { name: 'x.txt', type: TreeNodeType.File, size: 0 }
      const data = expectOkWrapped(file)
      expect(data.children).toEqual([file])
    })
  })

  describe('schema failures (invalid JSON shape / types)', () => {
    it.each([
      ['null', null],
      ['undefined', undefined],
      ['number', 123],
      ['boolean', true],
      ['string', 'not-json-tree'],
      ['empty array', []],
    ])('rejects %s', (_label, value) => {
      expectFail(value)
    })

    it('rejects empty object', () => {
      expectFail({})
    })

    it('rejects missing discriminant type', () => {
      expectFail({ name: 'a' }, 'Invalid tree at "root"')
    })

    it('rejects invalid type literal', () => {
      expectFail({ name: 'a', type: 'directory', children: [] }, 'Invalid tree')
    })

    it('rejects file missing size', () => {
      expectFail({ name: 'a', type: TreeNodeType.File })
    })

    it('rejects file with negative size', () => {
      expectFail({ name: 'a', type: TreeNodeType.File, size: -1 }, 'non-negative')
    })

    it('rejects folder missing children', () => {
      expectFail({ name: 'a', type: TreeNodeType.Folder })
    })

    it('rejects folder with null children', () => {
      expectFail({ name: 'a', type: TreeNodeType.Folder, children: null })
    })

    it('rejects folder with non-array children', () => {
      expectFail({ name: 'a', type: TreeNodeType.Folder, children: {} })
    })

    it('rejects empty trimmed name on file', () => {
      expectFail({ name: '   ', type: TreeNodeType.File, size: 0 }, 'name')
    })

    it('rejects empty name on folder', () => {
      expectFail({ name: '', type: TreeNodeType.Folder, children: [] }, 'name')
    })

    it('rejects array containing a primitive', () => {
      expectFail([complexValidSingleRoot, 1])
    })

    it('rejects array with invalid node', () => {
      expectFail([{ name: 'ok', type: TreeNodeType.Folder, children: [] }, { foo: 1 }])
    })
  })

  describe('duplicate name rules', () => {
    it('rejects duplicate direct children in a folder', () => {
      expectFail(
        {
          name: 'root',
          type: TreeNodeType.Folder,
          children: [
            { name: 'dup', type: TreeNodeType.File, size: 1 },
            { name: 'dup', type: TreeNodeType.File, size: 2 },
          ],
        },
        'Duplicate name "dup"',
      )
    })

    it('rejects duplicates among top-level roots in an array', () => {
      expectFail(
        [
          { name: 'same', type: TreeNodeType.Folder, children: [] },
          { name: 'same', type: TreeNodeType.File, size: 0 },
        ],
        'among top-level roots',
      )
    })

    it('rejects duplicate names in a nested folder', () => {
      expectFail(
        {
          name: 'root',
          type: TreeNodeType.Folder,
          children: [
            {
              name: 'pkg',
              type: TreeNodeType.Folder,
              children: [
                { name: 'index.ts', type: TreeNodeType.File, size: 1 },
                { name: 'index.ts', type: TreeNodeType.File, size: 2 },
              ],
            },
          ],
        },
        'Duplicate name "index.ts"',
      )
    })

    it('allows same name in different branches', () => {
      const tree = {
        name: 'root',
        type: TreeNodeType.Folder,
        children: [
          {
            name: 'a',
            type: TreeNodeType.Folder,
            children: [{ name: 'file.txt', type: TreeNodeType.File, size: 1 }],
          },
          {
            name: 'b',
            type: TreeNodeType.Folder,
            children: [{ name: 'file.txt', type: TreeNodeType.File, size: 2 }],
          },
        ],
      }
      const data = expectOkWrapped(tree)
      expect(data.children[0]).toEqual(tree)
    })
  })
})

describe('wrapAsCoreExplorerRoot', () => {
  it('builds a folder with fixed core name', () => {
    const roots: TreeNode[] = [
      { name: 'a', type: TreeNodeType.File, size: 1 },
    ]
    const wrapped = wrapAsCoreExplorerRoot(roots)
    expect(wrapped).toEqual({
      name: CORE_EXPLORER_ROOT_NAME,
      type: TreeNodeType.Folder,
      children: roots,
    })
  })
})
