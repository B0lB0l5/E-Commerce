const generateMessages = (entity) => ({
  alreadyExist: `${entity} Already Exist`,
  notFound: `${entity} Not Found`,
  createdSuccessfully: `${entity} Created Successfully`,
  updatedSuccessfully: `${entity} Updated Successfully`,
  deletedSuccessfully: `${entity} Deleted Successfully`,
  failToCreate: `Fail to create ${entity}`,
  failToUpdate: `Fail to Update ${entity}`,
  failToDelete: `Fail to Delete ${entity}`,
  fetchedSuccessfully: `${entity} fetched successfully`,
  invalidRequest:`invalid request`,
});
export const messages = {
  category: generateMessages("Category"),
  subcategory: generateMessages("Subcategory"),
  brand: generateMessages("Brand"),
  file: { required: 'file is required' },
  product: {
    ...generateMessages('product'),
    stockNotEnough: 'stock is not enough',
    addedToCart: 'product added to cart successfully',
    failToAddToCart: 'Failed to add product to cart',
    deletedFromCart: 'product deleted from cart successfully',
    notExistInCart: 'product not exist in cart',
},
  order: generateMessages('order'),
  wishList: generateMessages('wishList'),
  user: {
    ...generateMessages('user'),
    verified: "user verified successfully",
    invalidCredentials: "invalid Credntiols",
    notVerified: "not Verified",
    loginSuccessfully: "login successfully",
    unauthorized: "unauthorized to access this api",
    notHaveCart: "you don't have cart, please add product to cart first",
},
  review: generateMessages('review'),
  coupon: {
    ...generateMessages('coupon'),
    discountAmount: "must be less than 100",
    notAssigned: "coupon not assigned to you",
    couponExpired: "coupon expired, please use another one",
}
}
