import { formatBytes } from '../src/utils'

test('kB', () => {
  expect(formatBytes(2000)).toBe('2.0kB')
})

test('MB', () => {
  expect(formatBytes(1024 * 1024 * 1.5)).toBe('1.5MB')
})
