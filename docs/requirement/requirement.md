# Topic: Building a Zero-Waste Store Management Website Integrated with an AI Chatbot for Green Lifestyle Consultation[cite: 1]

## 1.1. Detailed Problem Description[cite: 1]

### Current Context
In recent years, issues related to environmental pollution, climate change, the depletion of natural resources, and the increasing volume of domestic waste have become major concerns for the entire society[cite: 1]. Faced with this reality, the trend of green consumption and the Zero-Waste lifestyle is gradually becoming a preferred choice for many people to minimize negative impacts on the environment[cite: 1].

Eco-friendly products such as bamboo toothbrushes, grass straws, reusable canvas bags, stainless steel water bottles, biodegradable food containers, organic soaps, recycled products, and many other sustainable items are gaining increasing attention from consumers[cite: 1]. However, access to these products as well as knowledge related to a green lifestyle in Vietnam remains quite limited because the market is not yet systematically organized and lacks professional supporting technological platforms[cite: 1].

---

### Current State of Zero-Waste Store Management
Currently, most stores selling Zero-Waste products operate on a small or medium scale, primarily selling through social media platforms such as Facebook, Zalo, or Instagram[cite: 1].

The management of products, orders, inventory, and customers is usually done manually using physical ledgers or Excel spreadsheets[cite: 1]. This leads to many shortcomings, such as:
* Difficulty in controlling inventory levels[cite: 1].
* High risk of errors during order processing[cite: 1].
* Time-consuming revenue report generation[cite: 1].
* Difficulty in tracking customer shopping behaviors[cite: 1].

Furthermore, stores often lack tools to provide continuous and in-depth customer consultation, making it difficult for consumers to select products that meet their needs and fully understand the specific environmental benefits these products offer[cite: 1].

---

### Customer Pain Points
For customers, the biggest barrier when adopting a Zero-Waste lifestyle lies not only in finding a place to buy products but also in the lack of knowledge and guidance during the process of changing their consumption habits[cite: 1].

Many people want to start living green but do not know:
* Which products to choose and how to use them properly[cite: 1].
* Whether a product is truly environmentally friendly[cite: 1].
* What specific benefits replacing single-use items with reusable ones will bring to the environment[cite: 1].

Meanwhile, store consulting staff cannot support customers 24/7, especially during peak traffic periods[cite: 1]. This degrades the user experience and negatively impacts the conversion rate from casual visitors into paying customers[cite: 1].

---

### Proposed Solution & Target Users
Stemming from these practical demands, the project “**Building a Zero-Waste store management website integrated with an AI Chatbot for green lifestyle consultation**” is proposed to build a specialized e-commerce system for the eco-friendly business sector[cite: 1]. The system serves not only as an online sales channel but also as a platform to support the comprehensive management of business operations while providing intelligent consulting tools for users via artificial intelligence[cite: 1].

The system is built around three main user groups:
* **Customers:** Users who utilize online shopping features, manage personal information, and receive lifestyle consultation from the system[cite: 1].
* **Administrators:** Individuals responsible for operating and managing all store activities[cite: 1].
* **AI Chatbot:** Acts as a virtual assistant to interact with customers, provide information, and offer green lifestyle consultation[cite: 1].

---

### Database Management Requirements
To meet management requirements, the system needs to build and store a centralized database comprising several different data groups[cite: 1]:

* **User Data:** Stores information such as user ID, full name, email address, encrypted password, phone number, delivery address, avatar, user role, account status, and account creation timestamp[cite: 1].
* **Product Category Data:** Manages categories such as personal care items, kitchenware, recycled products, organic products, healthcare products, and other product groups[cite: 1].
* **Product Data:** Stores detailed information including product ID, product name, category, detailed description, manufacturing material, origin, selling price, promotional price, stock quantity, expiration date, illustrative images, environmental benefit information, business status, and last updated timestamp[cite: 1].
* **Cart & Order Data:**
    * Manages shopping cart data, storing items selected by customers that have not yet been paid for[cite: 1].
    * Manages order data, including order ID, order timestamp, recipient information, delivery address, payment method, payment status, shipping status, and total order value[cite: 1].
    * Manages order details to store the list of purchased products in each order, along with their quantity and price at the time of purchase[cite: 1].
* **Payment Data:** Records transactions generated from payment methods such as Cash on Delivery (COD), bank transfer, or online payment[cite: 1].
* **Product Review Data:** Allows customers to review and rate the products they have used, aiming to enhance the user experience and build a green living community[cite: 1].
* **Article & News Data:** Manages the publishing of content sharing knowledge on environmental protection, practical guides to the Zero-Waste lifestyle, new product introductions, and promotional campaigns[cite: 1]. Each article includes a title, content, illustrative image, author, publish date, and display status[cite: 1].

---

### Integration of the Green Lifestyle AI Chatbot
One of the most important components of the system is the AI chatbot for green lifestyle consultation[cite: 1]. To support this function:
* The system must manage a **knowledge base** containing product information, environmental knowledge, green living guides, frequently asked questions (FAQs), and consultation rules[cite: 1].
* The system also logs **conversation history** between users and the chatbot to monitor, evaluate response quality, and improve the efficiency of the AI model[cite: 1].

When a customer asks a question, the chatbot receives the input, performs semantic analysis using a **Large Language Model (LLM)**, retrieves relevant data from the knowledge base, and generates an appropriate answer[cite: 1]. The chatbot can perform various functions such as introducing products, comparing eco-friendly alternatives, explaining the environmental impact of each product, and recommending sustainable consumption habits based on the user's specific needs[cite: 1].

---

### Operational Workflow (System Business Logic)

#### 1. For Customers
The operational workflow of the system begins when a customer visits the website, registers, or logs into their account[cite: 1].
* Customers can browse product categories or use the search function by product name, category, price range, or environmentally relevant criteria[cite: 1].
* Upon finding a suitable product, customers can view detailed information and reviews from other users, and add the product to their cart[cite: 1].
* After completing their selection, customers proceed to checkout by entering delivery information and selecting a payment method[cite: 1].
* The system verifies inventory, creates the order, updates the remaining product stock, and sends an order confirmation notification[cite: 1].
* Throughout the fulfillment process, customers can track their order status from confirmation, packaging, and shipping, to successful delivery[cite: 1].

#### 2. For Administrators
The system provides full management functions to support store operations[cite: 1]. Administrators can:
* Add, edit, or delete products[cite: 1].
* Update selling prices and stock quantities; manage product categories[cite: 1].
* Monitor products that are out of stock, running low, or nearing their expiration dates[cite: 1].
* Process and confirm orders; manage customer information; manage article content[cite: 1].
* Update the chatbot's knowledge base while monitoring user feedback[cite: 1].
* View statistical reports and charts on daily, monthly, and annual revenue[cite: 1].
* Track order volumes, best-selling products, and customer repeat purchase rates[cite: 1].
* Evaluate the chatbot's operational performance and various other administrative metrics[cite: 1]. These reports assist managers in assessing business performance and making appropriate strategic decisions[cite: 1].

---

### Conclusion
In summary, the problem at hand is not just building a conventional online sales website, but moving towards the creation of a digital ecosystem that supports sustainable consumption[cite: 1]. By combining e-commerce, centralized data management, and artificial intelligence technology, the system helps optimize operational workflows for businesses, elevates the customer experience, and contributes to spreading awareness of environmental protection and promoting a green lifestyle within the community[cite: 1].