export const AUTH_ERRORS = {
    INVALID_CREDENTIALS: {
        message: 'Authentication credentials are invalid.',
        statusCode: 401,
    },
    MISSING_AUTH: {
        message: 'Authentication is required to access this resource.',
        statusCode: 401,
    },
    INSUFFICIENT_PERMISSIONS: {
        message: 'User does not have permission to perform this action.',
        statusCode: 403,
    },
    TOKEN_EXPIRED: {
        message: 'Authentication token has expired. Please log in again.',
        statusCode: 401,
    },
    TOKEN_INVALID: {
        message: 'Authentication token is invalid or malformed.',
        statusCode: 401,
    },
    USER_NOT_FOUND: {
        message: 'User associated with this token no longer exists.',
        statusCode: 401,
    },
    TOKEN_VERIFICATION_FAILED: {
        message: 'Failed to verify authentication token.',
        statusCode: 401,
    },
}

export const USER_ERRORS = {
    NOT_FOUND: {
        message: 'User does not exist or could not be found.',
        statusCode: 404,
    },
    ALREADY_EXISTS: {
        message: 'User with this email already exists.',
        statusCode: 409,
    },
}

export const RESOURCE_ERRORS = {
    NOT_FOUND: {
        message: 'Requested resource was not found.',
        statusCode: 404,
    },
    UNAUTHORIZED_ACCESS: {
        message: 'User is not authorized to access this resource.',
        statusCode: 403,
    },
}

export const PRODUCT_ERRORS = {
    NAME_EXISTS: {
        message: 'A product with this name already exists.',
        statusCode: 409,
    },
    NOT_FOUND: {
        message: 'Product not found.',
        statusCode: 404,
    },
    INVALID_CATEGORY: {
        message: 'The provided category ID is invalid.',
        statusCode: 400,
    },
    INVALID_ID: {
        message: 'Invalid Product ID.',
        statusCode: 400,
    },
    VARIANT_EXISTS: {
        message: 'A product variant with the same color and size already exists.',
        statusCode: 409,
    },
}

export const PRODUCT_VARIANTS_ERRORS = {
    ALREADY_EXISTS: {
        message: 'Product variant already exists.',
        statusCode: 409,
    },
    NOT_FOUND: {
        message: 'Product variant not found.',
        statusCode: 404,
    },
    INVALID_ID: {
        message: 'Invalid Product Variants ID.',
        statusCode: 400,
    },
}

export const CATEGORY_ERRORS = {
    MISSING_NAME: {
        message: 'Category name is required.',
        statusCode: 400,
    },
    NOT_FOUND: {
        message: 'Category not found.',
        statusCode: 404,
    },
    ALREADY_EXISTS: {
        message: 'Category with this name already exists.',
        statusCode: 409,
    },
    INVALID_ID: {
        message: 'Invalid category ID.',
        statusCode: 400,
    },
    DELETE_CONFLICT: {
        message: 'Cannot delete category because it is linked to existing products.',
        statusCode: 401,
    },
}

export const ORDER_ERRORS = {
    NOT_FOUND: {
        message: 'Order does not exist or could not be found.',
        statusCode: 404,
    },
    ITEMS_REQUIRED: {
        message: 'Order must contain at least one item.',
        statusCode: 400,
    },
    INVALID_STATUS: {
        message: 'Invalid order status provided.',
        statusCode: 400,
    },
    INSUFFICIENT_STOCK: {
        message: 'One or more items in this order have insufficient stock.',
        statusCode: 400,
    },
    UNAUTHORIZED: {
        message: 'You are not authorized to access or modify this order.',
        statusCode: 403,
    },
    CANNOT_MODIFY: {
        message: 'This order cannot be modified in its current status.',
        statusCode: 400,
    },
    PAYMENT_REQUIRED: {
        message: 'Payment is required to complete this order.',
        statusCode: 402,
    },
    ITEM_NOT_FOUND: {
        message: 'One or more order items could not be found.',
        statusCode: 404,
    },
    PRODUCT_UNAVAILABLE: {
        message: 'One or more products in this order are no longer available.',
        statusCode: 400,
    },
    VALIDATION_ERROR: {
        message: 'Order data validation failed.',
        statusCode: 400,
    },
}

export const ORDER_ITEM_ERRORS = {
    NOT_FOUND: {
        message: 'Order item does not exist or could not be found.',
        statusCode: 404,
    },
    INVALID_QUANTITY: {
        message: 'Invalid quantity specified for order item.',
        statusCode: 400,
    },
    PRODUCT_NOT_FOUND: {
        message: 'Product variant specified in order item does not exist.',
        statusCode: 404,
    },
}
