import mongoose from "mongoose";
import User from "./models/user.js";
import Author from "./models/author.js";
import Story from "./models/story.js";
import Comment from "./models/comment.js";

// Thay bằng database của bạn
const MONGO_URI = "mongodb://127.0.0.1:27017/Story_App";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected", mongoose.connection.name))
  
  .catch(err => console.error("❌ MongoDB connect error:", err));

  mongoose.connection.once("open", () => {
  console.log("✅ MongoDB connected to DB:", mongoose.connection.name);
});
async function seed() {
  try {
    // Xoá dữ liệu cũ
    await User.deleteMany({});
    await Author.deleteMany({});
    await Story.deleteMany({});
    await Comment.deleteMany({});
    console.log("🗑️  Collections cleared");

    // 1️⃣ Users
    const users = await User.insertMany([
      {
        username: "user1",
        email: "user1@example.com",
        password: "123456",
        role: "user",
        avatarUrl: "https://example.com/avatar/user1.jpg",
        bio: "Mình thích đọc truyện"
      },
      {
        username: "user2",
        email: "user2@example.com",
        password: "123456",
        role: "user",
        avatarUrl: "https://example.com/avatar/user2.jpg",
        bio: "Mình là fan của truyện tranh"
      },
      {
        username: "admin",
        email: "admin@example.com",
        password: "123456",
        role: "admin",
        avatarUrl: "",
        bio: "Admin hệ thống"
      }
    ]);
    console.log("👤 Users inserted:", users.map(u => u._id));

    // 2️⃣ Authors
    const authors = await Author.insertMany([
      {
        name: "Nguyễn Nhật Ánh",
        bio: "Nhà văn nổi tiếng với các tác phẩm thiếu nhi.",
        avatarUrl: "https://example.com/avatar/nguyen-nhat-anh.jpg"
      },
      {
        name: "Haruki Murakami",
        bio: "Nhà văn Nhật Bản nổi tiếng.",
        avatarUrl: "https://example.com/avatar/haruki-murakami.jpg"
      }
    ]);
    console.log("✍️  Authors inserted:", authors.map(a => a._id));

    // 3️⃣ Stories
    const stories = await Story.insertMany([
      {
        title: "Cho tôi xin một vé đi tuổi thơ",
        slug: "cho-toi-xin-mot-ve-di-tuoi-tho",
        description: "Một tác phẩm thiếu nhi kinh điển.",
        coverImage: "https://example.com/story1.jpg",
        authorId: authors[0]._id,
        type: "novel",
        status: "completed",
        createdBy: users[0]._id
      },
      {
        title: "Kafka bên bờ biển",
        slug: "kafka-ben-bo-bien",
        description: "Tiểu thuyết hiện thực huyền ảo.",
        coverImage: "https://example.com/story2.jpg",
        authorId: authors[1]._id,
        type: "novel",
        status: "ongoing",
        createdBy: users[1]._id
      }
    ]);
    console.log("📚 Stories inserted:", stories.map(s => s._id));

    // 4️⃣ Comments
    const comments = await Comment.insertMany([
      {
        storyId: stories[0]._id,
        userId: users[0]._id,
        content: "Truyện hay quá!"
      },
      {
        storyId: stories[0]._id,
        userId: users[1]._id,
        content: "Mình thích nhân vật chính."
      },
      {
        storyId: stories[1]._id,
        userId: users[0]._id,
        content: "Cốt truyện hơi khó hiểu nhưng hấp dẫn."
      }
    ]);
    console.log("💬 Comments inserted:", comments.map(c => c._id));

    console.log("🎉 Seed data thành công!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seed();
