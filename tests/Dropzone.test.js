import Dropzone, {
  formatBytes,
  formatDuration,
  accepts,
  defaultClassNames,
  Input,
  Preview,
  SubmitButton,
} from '../src/Dropzone'

test('formatBytes', () => {
  expect(formatBytes(2000)).toBe('2.0kB')
})

test('formatBytes', () => {
  expect(formatBytes(1024 * 1024 * 1.5)).toBe('1.5MB')
})

test('formatDuration', () => {
  expect(formatDuration(1000)).toBe('16:40')
})
