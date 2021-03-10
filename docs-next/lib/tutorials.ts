import path from 'path';
import { getPackages } from '@manypkg/get-packages';
import fs from 'fs-extra';
import renderToString from 'next-mdx-remote/render-to-string';
import { components } from '../components/Page';
import matter from 'gray-matter';

export async function getTutorialData(id) {
  const tutorialDir = await getPackages(process.cwd()).then(({ packages }) => {
    return packages.find(pkg => pkg.packageJson.name === `@keystone-tutorials/${id}`).dir;
  });

  const markdown = fs.readFileSync(path.resolve(tutorialDir, 'docs', 'index.mdx'), 'utf-8');

  const { content, data } = matter(markdown);
  const children = await renderToString(content, { components, scope: data });

  return { children, data };
}

export async function getTutorialIds() {
  const tutorialIds = await getPackages(process.cwd()).then(({ root, packages }) => {
    return packages
      .filter(pkg => pkg.dir.includes(path.resolve(root.dir, 'tutorials')))
      .map(pkg => ({
        params: {
          slug: pkg.packageJson.name.replace('@keystone-tutorials/', ''),
        },
      }));
  });

  return tutorialIds;
}
