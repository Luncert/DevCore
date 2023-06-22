import path from "path";

const cwd = process.cwd();
function createWebpackAliases(aliases: any) {
  const result = {} as any;
  for (const name in aliases) {
    result[name] = path.join(cwd, aliases[name]);
  }
console.log(result)

  return result;
}

export default createWebpackAliases({
  '@assets': 'assets',
  '@common': 'src/common',
  '@main': 'src/main',
  '@renderer': 'src/renderer',
  '@src': 'src',
})
