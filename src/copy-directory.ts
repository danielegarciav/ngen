import { Stats } from 'fs';
import { copyFile, mkdir, readdir, stat } from 'fs/promises';
import { join as joinPath } from 'path';

type StatResult = [nodeName: string, fullPath: string, stats: Stats];

/**
 * Recursively copies the contents at `srcDirPath` to `destDirPath`.
 * @param srcDirPath Source directory path
 * @param destDirPath Target directory path
 */
export async function copyDirectory(srcDirPath: string, destDirPath: string): Promise<void> {
  const srcFsNodes = await readdir(srcDirPath);
  const srcFsNodeStats = await Promise.all(
    srcFsNodes.map(async nodeName => {
      const fullPath = joinPath(srcDirPath, nodeName);
      const stats = await stat(fullPath);
      return [nodeName, fullPath, stats] as StatResult;
    }),
  );

  const srcFiles = [];
  const srcDirectories = [];

  for (const nodeStats of srcFsNodeStats) {
    if (nodeStats[2].isFile()) srcFiles.push(nodeStats);
    else if (nodeStats[2].isDirectory() && nodeStats[0] !== 'node_modules') srcDirectories.push(nodeStats);
  }

  await mkdir(destDirPath, { recursive: true });

  // Copy all files in current directory first, then copy all directories recursively
  await Promise.all(
    srcFiles.map(async ([fileName, fullSrcPath]) => {
      const fullDestPath = joinPath(destDirPath, fileName);
      return copyFile(fullSrcPath, fullDestPath);
    }),
  );

  await Promise.all(
    srcDirectories.map(async ([dirName, fullSrcPath]) => {
      const fullDestPath = joinPath(destDirPath, dirName);
      return copyDirectory(fullSrcPath, fullDestPath);
    }),
  );
}
