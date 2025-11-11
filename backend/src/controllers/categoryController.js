import Category from "../models/category.js";
import { StatusCodes } from "http-status-codes";

// 🔹 READ: Lấy tất cả category
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(StatusCodes.OK).json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            success: false,
            message: "Lỗi server" 
        });
    }
};

// 🔹 CREATE: Thêm category mới (chỉ admin)
export const createCategory = async (req, res) => {
    try {
        const { name, slug, description } = req.body;

        if (!name || !slug) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                success: false,
                message: "Thiếu name hoặc slug" 
            });
        }

        // Kiểm tra trùng name
        const existingName = await Category.findOne({ name });
        if (existingName) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                success: false,
                message: "Tên thể loại đã tồn tại" 
            });
        }

        // Kiểm tra trùng slug
        const existingSlug = await Category.findOne({ slug });
        if (existingSlug) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                success: false,
                message: "Slug đã tồn tại" 
            });
        }

        const newCategory = new Category({ name, slug, description });
        await newCategory.save();

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Category created",
            data: newCategory
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            success: false,
            message: "Lỗi server" 
        });
    }
};

// 🔹 UPDATE: Sửa category (chỉ admin)
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, description } = req.body;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(StatusCodes.NOT_FOUND).json({ 
                success: false,
                message: "Category không tồn tại" 
            });
        }

        // Kiểm tra name trùng (nếu name thay đổi)
        if (name && name !== category.name) {
            const existingName = await Category.findOne({ name });
            if (existingName) {
                return res.status(StatusCodes.BAD_REQUEST).json({ 
                    success: false,
                    message: "Tên thể loại đã tồn tại" 
                });
            }
        }

        // Kiểm tra slug trùng (nếu slug thay đổi)
        if (slug && slug !== category.slug) {
            const existingSlug = await Category.findOne({ slug });
            if (existingSlug) {
                return res.status(StatusCodes.BAD_REQUEST).json({ 
                    success: false,
                    message: "Slug đã tồn tại" 
                });
            }
        }

        category.name = name || category.name;
        category.slug = slug || category.slug;
        if (description !== undefined) {
            category.description = description;
        }

        await category.save();

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Category updated",
            data: category
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            success: false,
            message: "Lỗi server" 
        });
    }
};

// 🔹 DELETE: Xóa category (chỉ admin)
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(StatusCodes.NOT_FOUND).json({ 
                success: false,
                message: "Category không tồn tại" 
            });
        }

        await Category.findByIdAndDelete(id);

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Category deleted"
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            success: false,
            message: "Lỗi server" 
        });
    }
};
