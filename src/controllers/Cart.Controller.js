const Cart = require('../models/Cart.model');
const User = require('../models/User.model');
const User_Address = require('../models/User_Address.model');
const Properties = require('../models/Properties.model');
const Transaction = require('../models/Transaction.model');

// Create Cart
const createCart = async (req, res) => {
  try {
    const {
      seller,
      seller_address_id,
      Buyer,
      Buyer_address_id,
      Property_id,
      Delivery_Date_range,
      Price,
      Quantity,
      payment_method,
      Transaction_id,
      Status
    } = req.body;

    // Validate that seller exists
    const sellerUser = await User.findOne({ user_id: seller });
    if (!sellerUser) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    // Validate that buyer exists
    const buyerUser = await User.findOne({ user_id: Buyer });
    if (!buyerUser) {
      return res.status(404).json({
        success: false,
        message: 'Buyer not found'
      });
    }

    // Validate that seller address exists
    const sellerAddress = await User_Address.findOne({ Address_id: seller_address_id });
    if (!sellerAddress) {
      return res.status(404).json({
        success: false,
        message: 'Seller address not found'
      });
    }

    // Validate that buyer address exists
    const buyerAddress = await User_Address.findOne({ Address_id: Buyer_address_id });
    if (!buyerAddress) {
      return res.status(404).json({
        success: false,
        message: 'Buyer address not found'
      });
    }

    // Validate that property exists
    const property = await Properties.findOne({ Properties_id: Property_id });
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Validate that transaction exists if provided
    if (Transaction_id) {
      const transaction = await Transaction.findOne({ Transaction_id: Transaction_id });
      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
      }
    }

    const cart = new Cart({
      seller,
      seller_address_id,
      Buyer,
      Buyer_address_id,
      Property_id,
      Delivery_Date_range,
      Price,
      Quantity,
      payment_method,
      Transaction_id,
      Status: Status !== undefined ? Status : true,
      CreateBy: req.user.user_id,
      UpdatedBy: req.user.user_id
    });

    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Cart created successfully',
      data: cart
    });
  } catch (error) {
    console.error('Error creating cart:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get All Carts
const getAllCarts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { payment_method: { $regex: search, $options: 'i' } },
          { Delivery_Date_range: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const carts = await Cart.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ CreateAt: -1 });

    // Manually populate all reference data
    for (let cart of carts) {
      if (cart.seller) {
        const seller = await User.findOne({ user_id: cart.seller });
        cart.seller = seller ? { user_id: seller.user_id, Name: seller.Name, last_name: seller.last_name, email: seller.email, phone: seller.phone } : null;
      }
      if (cart.Buyer) {
        const buyer = await User.findOne({ user_id: cart.Buyer });
        cart.Buyer = buyer ? { user_id: buyer.user_id, Name: buyer.Name, last_name: buyer.last_name, email: buyer.email, phone: buyer.phone } : null;
      }
      if (cart.seller_address_id) {
        const sellerAddress = await User_Address.findOne({ Address_id: cart.seller_address_id });
        cart.seller_address_id = sellerAddress ? { Address_id: sellerAddress.Address_id, address: sellerAddress.address, city_id: sellerAddress.city_id, state_id: sellerAddress.state_id, country_id: sellerAddress.country_id } : null;
      }
      if (cart.Buyer_address_id) {
        const buyerAddress = await User_Address.findOne({ Address_id: cart.Buyer_address_id });
        cart.Buyer_address_id = buyerAddress ? { Address_id: buyerAddress.Address_id, address: buyerAddress.address, city_id: buyerAddress.city_id, state_id: buyerAddress.state_id, country_id: buyerAddress.country_id } : null;
      }
      if (cart.Property_id) {
        const property = await Properties.findOne({ Properties_id: cart.Property_id });
        cart.Property_id = property ? { Properties_id: property.Properties_id, Property_Address: property.Property_Address, Property_city: property.Property_city, Property_state: property.Property_state, Property_Listing_Price: property.Property_Listing_Price } : null;
      }
      if (cart.Transaction_id) {
        const transaction = await Transaction.findOne({ Transaction_id: cart.Transaction_id });
        cart.Transaction_id = transaction ? { Transaction_id: transaction.Transaction_id, payment_method: transaction.payment_method, payment_Status: transaction.payment_Status } : null;
      }
      if (cart.CreateBy) {
        const createUser = await User.findOne({ user_id: cart.CreateBy });
        cart.CreateBy = createUser ? { user_id: createUser.user_id, Name: createUser.Name, last_name: createUser.last_name } : null;
      }
      if (cart.UpdatedBy) {
        const updateUser = await User.findOne({ user_id: cart.UpdatedBy });
        cart.UpdatedBy = updateUser ? { user_id: updateUser.user_id, Name: updateUser.Name, last_name: updateUser.last_name } : null;
      }
    }

    const total = await Cart.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Carts retrieved successfully',
      data: carts,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error getting carts:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get Cart by ID
const getCartById = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await Cart.findOne({ cart_id: id });

    // Manually populate all reference data
    if (cart) {
      if (cart.seller) {
        const seller = await User.findOne({ user_id: cart.seller });
        cart.seller = seller ? { user_id: seller.user_id, Name: seller.Name, last_name: seller.last_name, email: seller.email, phone: seller.phone } : null;
      }
      if (cart.Buyer) {
        const buyer = await User.findOne({ user_id: cart.Buyer });
        cart.Buyer = buyer ? { user_id: buyer.user_id, Name: buyer.Name, last_name: buyer.last_name, email: buyer.email, phone: buyer.phone } : null;
      }
      if (cart.seller_address_id) {
        const sellerAddress = await User_Address.findOne({ Address_id: cart.seller_address_id });
        cart.seller_address_id = sellerAddress ? { Address_id: sellerAddress.Address_id, address: sellerAddress.address, city_id: sellerAddress.city_id, state_id: sellerAddress.state_id, country_id: sellerAddress.country_id } : null;
      }
      if (cart.Buyer_address_id) {
        const buyerAddress = await User_Address.findOne({ Address_id: cart.Buyer_address_id });
        cart.Buyer_address_id = buyerAddress ? { Address_id: buyerAddress.Address_id, address: buyerAddress.address, city_id: buyerAddress.city_id, state_id: buyerAddress.state_id, country_id: buyerAddress.country_id } : null;
      }
      if (cart.Property_id) {
        const property = await Properties.findOne({ Properties_id: cart.Property_id });
        cart.Property_id = property ? { Properties_id: property.Properties_id, Property_Address: property.Property_Address, Property_city: property.Property_city, Property_state: property.Property_state, Property_Listing_Price: property.Property_Listing_Price } : null;
      }
      if (cart.Transaction_id) {
        const transaction = await Transaction.findOne({ Transaction_id: cart.Transaction_id });
        cart.Transaction_id = transaction ? { Transaction_id: transaction.Transaction_id, payment_method: transaction.payment_method, payment_Status: transaction.payment_Status } : null;
      }
      if (cart.CreateBy) {
        const createUser = await User.findOne({ user_id: cart.CreateBy });
        cart.CreateBy = createUser ? { user_id: createUser.user_id, Name: createUser.Name, last_name: createUser.last_name } : null;
      }
      if (cart.UpdatedBy) {
        const updateUser = await User.findOne({ user_id: cart.UpdatedBy });
        cart.UpdatedBy = updateUser ? { user_id: updateUser.user_id, Name: updateUser.Name, last_name: updateUser.last_name } : null;
      }
    }

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cart retrieved successfully',
      data: cart
    });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update Cart
const updateCart = async (req, res) => {
  try {
    const { 
      cart_id, 
      seller, 
      seller_address_id, 
      Buyer, 
      Buyer_address_id, 
      Property_id, 
      Delivery_Date_range, 
      Price, 
      Quantity, 
      payment_method, 
      Transaction_id, 
      Status 
    } = req.body;

    const cart = await Cart.findOne({ cart_id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Validate that seller exists if seller is being updated
    if (seller) {
      const sellerUser = await User.findOne({ user_id: seller });
      if (!sellerUser) {
        return res.status(404).json({
          success: false,
          message: 'Seller not found'
        });
      }
    }

    // Validate that buyer exists if Buyer is being updated
    if (Buyer) {
      const buyerUser = await User.findOne({ user_id: Buyer });
      if (!buyerUser) {
        return res.status(404).json({
          success: false,
          message: 'Buyer not found'
        });
      }
    }

    // Validate that seller address exists if seller_address_id is being updated
    if (seller_address_id) {
      const sellerAddress = await User_Address.findOne({ Address_id: seller_address_id });
      if (!sellerAddress) {
        return res.status(404).json({
          success: false,
          message: 'Seller address not found'
        });
      }
    }

    // Validate that buyer address exists if Buyer_address_id is being updated
    if (Buyer_address_id) {
      const buyerAddress = await User_Address.findOne({ Address_id: Buyer_address_id });
      if (!buyerAddress) {
        return res.status(404).json({
          success: false,
          message: 'Buyer address not found'
        });
      }
    }

    // Validate that property exists if Property_id is being updated
    if (Property_id) {
      const property = await Properties.findOne({ Properties_id: Property_id });
      if (!property) {
        return res.status(404).json({
          success: false,
          message: 'Property not found'
        });
      }
    }

    // Validate that transaction exists if Transaction_id is being updated
    if (Transaction_id) {
      const transaction = await Transaction.findOne({ Transaction_id: Transaction_id });
      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
      }
    }

    const updateData = {
      UpdatedBy: req.user.user_id,
      UpdatedAt: new Date()
    };

    if (seller !== undefined) updateData.seller = seller;
    if (seller_address_id !== undefined) updateData.seller_address_id = seller_address_id;
    if (Buyer !== undefined) updateData.Buyer = Buyer;
    if (Buyer_address_id !== undefined) updateData.Buyer_address_id = Buyer_address_id;
    if (Property_id !== undefined) updateData.Property_id = Property_id;
    if (Delivery_Date_range !== undefined) updateData.Delivery_Date_range = Delivery_Date_range;
    if (Price !== undefined) updateData.Price = Price;
    if (Quantity !== undefined) updateData.Quantity = Quantity;
    if (payment_method !== undefined) updateData.payment_method = payment_method;
    if (Transaction_id !== undefined) updateData.Transaction_id = Transaction_id;
    if (Status !== undefined) updateData.Status = Status;

    const updatedCart = await Cart.findOneAndUpdate(
      { cart_id },
      updateData,
      { new: true }
    );

    // Manually populate all reference data
    if (updatedCart) {
      if (updatedCart.seller) {
        const seller = await User.findOne({ user_id: updatedCart.seller });
        updatedCart.seller = seller ? { user_id: seller.user_id, Name: seller.Name, last_name: seller.last_name, email: seller.email, phone: seller.phone } : null;
      }
      if (updatedCart.Buyer) {
        const buyer = await User.findOne({ user_id: updatedCart.Buyer });
        updatedCart.Buyer = buyer ? { user_id: buyer.user_id, Name: buyer.Name, last_name: buyer.last_name, email: buyer.email, phone: buyer.phone } : null;
      }
      if (updatedCart.seller_address_id) {
        const sellerAddress = await User_Address.findOne({ Address_id: updatedCart.seller_address_id });
        updatedCart.seller_address_id = sellerAddress ? { Address_id: sellerAddress.Address_id, address: sellerAddress.address, city_id: sellerAddress.city_id, state_id: sellerAddress.state_id, country_id: sellerAddress.country_id } : null;
      }
      if (updatedCart.Buyer_address_id) {
        const buyerAddress = await User_Address.findOne({ Address_id: updatedCart.Buyer_address_id });
        updatedCart.Buyer_address_id = buyerAddress ? { Address_id: buyerAddress.Address_id, address: buyerAddress.address, city_id: buyerAddress.city_id, state_id: buyerAddress.state_id, country_id: buyerAddress.country_id } : null;
      }
      if (updatedCart.Property_id) {
        const property = await Properties.findOne({ Properties_id: updatedCart.Property_id });
        updatedCart.Property_id = property ? { Properties_id: property.Properties_id, Property_Address: property.Property_Address, Property_city: property.Property_city, Property_state: property.Property_state, Property_Listing_Price: property.Property_Listing_Price } : null;
      }
      if (updatedCart.Transaction_id) {
        const transaction = await Transaction.findOne({ Transaction_id: updatedCart.Transaction_id });
        updatedCart.Transaction_id = transaction ? { Transaction_id: transaction.Transaction_id, payment_method: transaction.payment_method, payment_Status: transaction.payment_Status } : null;
      }
      if (updatedCart.CreateBy) {
        const createUser = await User.findOne({ user_id: updatedCart.CreateBy });
        updatedCart.CreateBy = createUser ? { user_id: createUser.user_id, Name: createUser.Name, last_name: createUser.last_name } : null;
      }
      if (updatedCart.UpdatedBy) {
        const updateUser = await User.findOne({ user_id: updatedCart.UpdatedBy });
        updatedCart.UpdatedBy = updateUser ? { user_id: updateUser.user_id, Name: updateUser.Name, last_name: updateUser.last_name } : null;
      }
    }

    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      data: updatedCart
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete Cart (Hard Delete)
const deleteCart = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await Cart.findOneAndDelete({ cart_id: id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cart deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting cart:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Soft Delete Cart (Deactivate)
const softDeleteCart = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await Cart.findOneAndUpdate(
      { cart_id: id },
      { 
        Status: false,
        UpdatedBy: req.user.user_id,
        UpdatedAt: new Date()
      },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cart deactivated successfully',
      data: cart
    });
  } catch (error) {
    console.error('Error deactivating cart:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  createCart,
  getAllCarts,
  getCartById,
  updateCart,
  deleteCart,
  softDeleteCart
};
