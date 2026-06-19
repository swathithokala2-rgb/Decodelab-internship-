require('dotenv').config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const SECRET_KEY = "bookstore_secret_key";
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
app.use(cors());
app.use(express.json());
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "yourgmail@gmail.com",
        pass: "your-app-password"
    }
});

// ======================================
// SCHEMAS
// ======================================

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  price: Number,
  category: String,
  image: String,
});

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
});

const orderSchema = new mongoose.Schema({
  bookId: String,
  title: String,
  quantity: Number,
  total: Number
});

const Book = mongoose.model("Book", bookSchema);
const Contact = mongoose.model("Contact", contactSchema);
const Order = mongoose.model("Order", orderSchema);
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);


app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ======================================
// GET BOOK BY ID
// ======================================

app.get("/api/books/:id", (req, res) => {

  const id = parseInt(req.params.id);

  const book = books.find(
    b => b.id === id
  );

  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found"
    });
  }

  res.json(book);
});


// ======================================
// SEARCH BOOKS
// ======================================

app.get("/api/search", (req, res) => {

  const keyword =
    req.query.title?.toLowerCase() || "";

  const result = books.filter(book =>
    book.title.toLowerCase().includes(keyword)
  );

  res.json(result);
});


// ======================================
// ADD BOOK
// ======================================


  
app.post("/api/books", async (req, res) => {

  try {
        console.log("BODY =", req.body);
    const { title, author, price, category, image } = req.body;

    const newBook = new Book({
      title,
      author,
      price,
      category,
      image
    });

    await newBook.save();

    res.status(201).json({
      message: "Book Added Successfully",
      data: newBook
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }

});

// ======================================
// ADD TO CART
// ======================================

app.post("/api/cart", (req, res) => {

  const { bookId } = req.body;

  const book = books.find(
    b => b.id === bookId
  );

  if (!book) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  cart.push(book);

  res.status(201).json({
    success: true,
    message: "Book added to cart",
    cart
  });
});


// ======================================
// VIEW CART
// ======================================

app.get("/api/cart", (req, res) => {
 res.json(cart);
});


// ======================================
// DELETE CART ITEM
// =====================================
app.post("/api/signup", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({
            email: email
        });

        if (existingUser) {

            return res.status(400).json({
                message: "Email already exists"
            });

        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = new User({
            name: name,
            email: email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            message: "Signup Successful"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});
app.post("/api/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid Email or Password"
            });
        }

        const match = await bcrypt.compare(
            password,
            user.password
        );

        if (!match) {
            return res.status(401).json({
                message: "Invalid Email or Password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            SECRET_KEY,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login Successful",
            name: user.name,
            token: token
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});
// ======================================
// CONTACT FORM
// ======================================

app.post("/api/contact", async (req, res) => {

  try {

    const contact = new Contact(req.body);

    await contact.save();

    res.status(201).json({
      message: "Contact Saved",
     data: contact
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }

});


// ======================================
// PLACE ORDER
//======================================
app.post("/api/orders", async (req, res) => {

  try {

    const order = new Order(req.body);

    await order.save();
    await transporter.sendMail({

    from: "yourgmail@gmail.com",

    to: "customer@gmail.com",

    subject: "Order Confirmation",

    text:
    `Your order has been placed successfully.

Order ID: ${order._id}
Book: ${order.title}
Quantity: ${order.quantity}
Total: ₹${order.total}

Thank You For Shopping!`

});

    res.status(201).json({
      message: "Order Saved",
      data: order
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }

});
app.post("/api/forgot-password", async (req, res) => {

    try {

        const { email, password } = req.body;

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user =
            await User.findOneAndUpdate(
                { email: email },
                { password: hashedPassword }
            );

        if (!user) {

            return res.status(404).json({
                message: "User Not Found"
            });

        }

        res.json({
            message: "Password Updated Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});



// ======================================
//  GET ORDERS
// ======================================

app.get("/api/orders", async (req, res) => {

  try {

    const orders = await Order.find();

    res.json(orders);

 } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});
app.delete("/api/books/:id", async (req, res) => {

    try {

        await Book.findByIdAndDelete(req.params.id);

        res.json({
            message: "Book Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});
app.get("/api/invoice/:id", async (req, res) => {

    try {

        const order = await Order.findById(
            req.params.id
        );

        if (!order) {

            return res.status(404).json({
                message: "Order Not Found"
            });

        }

        const PDFDocument =
            require("pdfkit");

        const doc =
            new PDFDocument();

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=invoice.pdf"
        );

        doc.pipe(res);

        doc.fontSize(25)
           .text("ONLINE BOOK STORE");

        doc.moveDown();

        doc.fontSize(18)
           .text("Invoice");

        doc.moveDown();

        doc.text("Order ID: " + order._id);

        doc.text(
            "Book: " + order.title
        );

        doc.text(
            "Quantity: " + order.quantity
        );

        doc.text(
            "Total Price: ₹" + order.total
        );

        doc.moveDown();

        doc.text(
            "Thank You For Shopping!"
        );

        doc.end();

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// ======================================
// MONGODB + SERVER
// ======================================
console.log("URI =", process.env.MONGODB_URI);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
   console.log("MongoDB Connected Successfully");

    const PORT = 3000;

    app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Error:", err);
});