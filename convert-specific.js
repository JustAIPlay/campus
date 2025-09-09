const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertSpecificImages() {
  const filesToConvert = [
    'images/人物/图书管理员.png',
    'images/人物/音乐老师.png'
  ];

  console.log('开始转换特定图片...');

  for (const pngPath of filesToConvert) {
    try {
      if (!fs.existsSync(pngPath)) {
        console.log(`❌ 文件不存在: ${pngPath}`);
        continue;
      }

      const webpPath = pngPath.replace('/images/', '/images-webp/').replace(/\.png$/i, '.webp');
      
      // 确保目标目录存在
      const targetDir = path.dirname(webpPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // 检查是否已存在
      if (fs.existsSync(webpPath)) {
        console.log(`⏭️  跳过已存在: ${path.basename(pngPath)}`);
        continue;
      }

      await sharp(pngPath)
        .webp({ quality: 80, effort: 6 })
        .toFile(webpPath);

      console.log(`✅ 转换完成: ${path.basename(pngPath)}`);
      
    } catch (error) {
      console.error(`❌ 转换失败: ${pngPath}`, error.message);
    }
  }

  console.log('特定图片转换完成！');
}

// 运行转换
convertSpecificImages().catch(console.error);