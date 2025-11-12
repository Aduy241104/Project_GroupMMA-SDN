import Author from "../models/author.js";

// Lấy tất cả tác giả
export const getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy tác giả theo ID
export const getAuthorById = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).json({ message: "Author not found" });
    res.status(200).json(author);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tạo tác giả mới
export const createAuthor = async (req, res) => {
  try {
    const { name, bio, avatarUrl } = req.body;
    const newAuthor = new Author({ name, bio, avatarUrl });
    const savedAuthor = await newAuthor.save();
    res.status(201).json(savedAuthor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật tác giả
export const updateAuthor = async (req, res) => {
  try {
    const { name, bio, avatarUrl } = req.body;
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      { name, bio, avatarUrl },
      { new: true, runValidators: true }
    );
    if (!updatedAuthor) return res.status(404).json({ message: "Author not found" });
    res.status(200).json(updatedAuthor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa tác giả
export const deleteAuthor = async (req, res) => {
  try {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
    if (!deletedAuthor) return res.status(404).json({ message: "Author not found" });
    res.status(200).json({ message: "Author deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
