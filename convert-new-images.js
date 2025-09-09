const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertNewImages() {
  const imageDir = path.join(__dirname, 'images');
  const webpDir = path.join(__dirname, 'images-webp');
  
  // 确保目标目录存在
  if (!fs.existsSync(webpDir)) {
    fs.mkdirSync(webpDir, { recursive: true });
  }

  // 查找所有PNG文件
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

  console.log(`找到 ${pngFiles.length} 个PNG文件，检查需要转换的文件...`);

  let convertedCount = 0;
  let skippedCount = 0;

  for (const pngPath of pngFiles) {
    try {
      const relativePath = path.relative(imageDir, pngPath);
      const webpPath = path.join(webpDir, relativePath).replace(/\.png$/i, '.webp');
      
      // 检查目标文件是否已存在
      if (fs.existsSync(webpPath)) {
        console.log(`⏭️  跳过已存在: ${relativePath}`);
        skippedCount++;
        continue;
      }

      // 确保目标目录存在
      const targetDir = path.dirname(webpPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      await sharp(pngPath)
        .webp({ quality: 80, effort: 6 })
        .toFile(webpPath);

      console.log(`✅ 转换完成: ${relativePath}`);
      convertedCount++;
      
    } catch (error) {
      console.error(`❌ 转换失败: ${pngPath}`, error.message);
    }
  }

  console.log(`\n转换完成！`);
  console.log(`✅ 新转换: ${convertedCount} 个文件`);
  console.log(`⏭️  跳过已存在: ${skippedCount} 个文件`);
  console.log(`📊 总计PNG文件: ${pngFiles.length} 个`);
}

// 运行转换
convertNewImages().catch(console.error);