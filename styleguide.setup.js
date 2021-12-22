import { getDroppedOrSelectedFiles, getDataTransferFiles } from 'html5-file-selector'

import Dropzone, { defaultClassNames } from './src/Dropzone'

global.getDroppedOrSelectedFiles = getDroppedOrSelectedFiles
global.getDataTransferFiles = getDataTransferFiles
global.Dropzone = Dropzone
global.defaultClassNames = defaultClassNames
