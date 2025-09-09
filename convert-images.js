const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertImages() {
  const imageDir = path.join(__dirname, 'images');
  
  // 创建webp目录
  const webpDir = path.join(__dirname, 'images-webp');
  if (!fs.existsSync(webpDir)) {
    fs.mkdirSync(webpDir, { recursive: true });
  }

  // 转换所有PNG图片
  const pngFiles = [];
  
  function findPngFiles(dir) {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        findPngFiles(fullPath);
      } else if (path.extname(item).toLowerCase() === '.png') {
        pngFiles.push(fullPath);
      }
    });
  }

  findPngFiles(imageDir);

  console.log(`找到 ${pngFiles.length} 个PNG文件，开始转换为WebP...`);

  for (const pngPath of pngFiles) {
    try {
      const relativePath = path.relative(imageDir, pngPath);
      const webpPath = path.join(webpDir, relativePath).replace(/\.png$/i, '.webp');
      
      // 确保目标目录存在
      const targetDir = path.dirname(webpPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      await sharp(pngPath)
        .webp({ quality: 80, effort: 6 })
        .toFile(webpPath);

      console.log(`✓ 转换完成: ${relativePath}`);
      
    } catch (error) {
      console.error(`✗ 转换失败: ${pngPath}`, error.message);
    }
  }

  console.log('所有图片转换完成！');
}

// 运行转换
convertImages().catch(console.error);