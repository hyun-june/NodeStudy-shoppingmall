const Product = require("../Model/Product");
const productController = {};
// const PAGE_SIZE = 3;

productController.createProduct = async (req, res) => {
  try {
    const {
      sku,
      name,
      size,
      image,
      category,
      description,
      price,
      stock,
      status,
    } = req.body;

    const product = new Product({
      sku,
      name,
      size,
      image,
      category,
      description,
      price,
      stock,
      status,
    });
    await product.save();
    res.status(200).json({ status: "success", product });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.getProducts = async (req, res) => {
  try {
    const { page, name } = req.query;
    const cond = name
      ? { name: { $regex: name, $options: "i" }, isDeleted: false }
      : { isDeleted: false };
    let query = Product.find(cond);
    let response = { status: "success" };
    // if (page) {
    //   query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
    //   최종 몇개 페이지 = 총 데이터 갯수 / PAGE_SIZE
    //   const totalItemNum = await Product.find(cond).countDocuments();
    //   const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
    //   response.totalPageNum = totalPageNum;
    // }

    const productList = await query.exec();
    response.data = productList;
    res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      sku,
      name,
      size,
      image,
      price,
      description,
      category,
      stock,
      status,
    } = req.body;
    const product = await Product.findByIdAndUpdate(
      { _id: productId },
      { sku, name, size, image, price, description, category, stock, status },
      { new: true }
    );
    if (!product) throw new Error("item doesn't exist");
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndUpdate(
      { _id: productId },
      { isDeleted: true },
      { new: true }
    );
    if (!product) throw new Error("No item found");
    res.status(200).json({ status: "success" });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) throw new Error("No item found");
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.checkStock = async (item) => {
  try {
    // 내가 사려는 아이템 재고 정보 들고오기
    const product = await Product.findById(item.productId);

    // 상품이 존재하지 않을 경우 에러 처리
    if (!product) {
      return {
        isVerify: false,
        message: "해당 상품이 존재하지 않습니다.",
      };
    }

    // 내가 사려는 아이템 qty, 재고 비교
    if (product.stock[item.size] < item.qty) {
      // 재고가 불충분하면 불충분 메세지와 함께 데이터 반환
      return {
        isVerify: false,
        message: `${product.name}의 ${item.size}재고가 부족합니다.`,
      };
    }

    return { isVerify: true };
  } catch (error) {
    console.error("Error in checkStock:", error.message); // 에러 로그 추가
    return {
      isVerify: false,
      message: "재고 확인 중 오류가 발생했습니다.",
    };
  }
};

productController.checkItemListStock = async (itemList) => {
  try {
    const insufficientStockItems = [];
    const sufficientItems = [];
    // 재고 확인 로직
    await Promise.all(
      itemList.map(async (item) => {
        console.log("Processing item:", item);
        const stockCheck = await productController.checkStock(item);
        console.log("Stock Check Result:", stockCheck);
        if (!stockCheck.isVerify) {
          insufficientStockItems.push({ item, message: stockCheck.message });
        } else {
          sufficientItems.push(item);
        }
      })
    );

    if (insufficientStockItems.length > 0) {
      return insufficientStockItems;
    }

    await Promise.all(
      sufficientItems.map(async (item) => {
        const product = await Product.findById(item.productId);
        product.stock[item.size] -= item.qty;
        await product.save();
      })
    );
    return [];
  } catch (error) {
    console.error("Error in checkItemListStock:", error.message);
    return { status: "fail", error: error.message };
  }
};

module.exports = productController;
