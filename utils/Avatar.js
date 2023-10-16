import blockies from 'ethereum-blockies';



// 通过地址去生成图像
export const ethereumAddressImage = (address) => {
  if (typeof document !== "undefined") {
    // 创建一个新的 <canvas> 元素
    const canvas = document.createElement("canvas");
    const canvasSize = 64; // 设置画布大小，根据需要调整
    const fontSize = 16; // 文本字体大小

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    // 在画布上绘制 blockies 图像
    const context = canvas.getContext("2d");
    const img = blockies.create({ seed: address.toLowerCase() });
    context?.drawImage(img, 0, 0, canvasSize, canvasSize); // 绘制 blockies 图像到画布

    // 创建一个新的临时 <canvas> 元素用于裁剪成圆形
    const circularCanvas = document.createElement("canvas");
    circularCanvas.width = canvasSize;
    circularCanvas.height = canvasSize;

    // 在临时画布上绘制圆形图像
    const circularContext = circularCanvas.getContext("2d");
    circularContext?.beginPath();
    circularContext?.arc(
      canvasSize / 2,
      canvasSize / 2,
      canvasSize / 2,
      0,
      2 * Math.PI
    );
    circularContext?.closePath();
    circularContext?.clip();
    circularContext?.drawImage(canvas, 0, 0, canvasSize, canvasSize);
    // 计算文本的居中位置
    // const textWidth = circularContext?.measureText(address).width || 0;
    // const textX = (canvasSize - textWidth) / 2;
    // const textY = canvasSize / 2 + fontSize / 2; // 垂直居中
    // 在圆形图像上方绘制地址文本
    // circularContext && (circularContext.font = "16px Arial");
    // circularContext && (circularContext.fillStyle = "#333"); // 文本颜色
    // circularContext?.fillText(address, textX, textY); // 调整文本位置

    // 将临时画布内容转换为图片格式（PNG）
    const imageDataURL = circularCanvas.toDataURL("image/png");

    return imageDataURL; // 返回生成的圆形图片地址
  }
};



