export default {
    branches: ['main'],
    plugins: [
        '@semantic-release/commit-analyzer', // 分析提交信息来决定版本号
        '@semantic-release/release-notes-generator', // 生成发布说明
        '@semantic-release/changelog', // 更新 CHANGELOG.md 文件
        '@semantic-release/npm', // 更新版本号并发布到 npm
        [
            '@semantic-release/git',
            {
                assets: ['package.json', 'CHANGELOG.md'],
                message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
            },
        ],
    ],
};
