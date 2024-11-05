const Order = require("../Model/Order");
const { randomStringGenerator } = require("../utils/randomStringGenerator");
const productController = require("./product.controller");
const orderController = {};

orderController.createOrder = async (req, res) => {
  try {
    //프론트엔드에서 데이터 보낸거 받아와 userId,totalPrice,shipTo,contact,orderList
    const { userId } = req;
    const { totalPrice, shipTo, contact, orderList } = req.body;

    if (!orderList || !Array.isArray(orderList)) {
      return res
        .status(400)
        .json({ status: "fail", error: "주문 목록이 필요합니다." });
    }
    // 재고 확인 & 재고 업데이트
    const insufficientStockItems = await productController.checkItemListStock(
      orderList
    );
    console.log("test", insufficientStockItems);
    if (!insufficientStockItems || !Array.isArray(insufficientStockItems)) {
      throw new Error("재고 확인 중 오류가 발생했습니다.");
    }

    // 재고가 충분하지 않는 아이템이 있었다 => 에러
    if (insufficientStockItems.length > 0) {
      const errorMessage = insufficientStockItems.reduce(
        (total, item) => (total += item.message),
        ""
      );
      throw new Error(errorMessage);
    }
    //order를 만들자!
    const newOrder = new Order({
      userId,
      totalPrice,
      shipTo,
      contact,
      items: orderList,
      orderNum: randomStringGenerator(),
    });
    await newOrder.save();
    res.status(200).json({ status: "success", orderNum: newOrder.orderNum });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = orderController;
