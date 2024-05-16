export default {
    tagFormat: 'v${version}',
    branches: [
        'master',
        'next',
        {
            name: 'beta',
            prerelease: true,
        },
        {
            name: 'alpha',
            prerelease: true,
        },
    ],
    plugins: [
        '@semantic-release/commit-analyzer', // 分析提交信息来决定版本号
        '@semantic-release/release-notes-generator', // 生成发布说明
        [
            '@semantic-release/changelog',
            {
                'changelogFile': 'CHANGELOG.md',
            },
        ],
        '@semantic-release/npm', // 更新版本号并发布到 npm
        [
            '@semantic-release/git',
            {
                assets: ['package.json', 'CHANGELOG.md'],
                message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
            },
        ],
        [
            '@semantic-release/github',
            {
                'assets': [
                    {
                        'path': './build/assets.tar.gz',
                    },
                ],
            },
        ],
    ],
};
