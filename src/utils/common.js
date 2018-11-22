import { remote } from 'electron';

export function openDirectory() {
  const openDirectory = remote.dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  if (openDirectory) {
    return openDirectory[0];
  }
  return null;
}
