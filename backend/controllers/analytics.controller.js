import { GoogleSheetService } from "./../services/GoogleSheetService.js";
const sheet = new GoogleSheetService();

export const todayStats = async (req, res) => {
  try {
    const { userDoc } = req;
    if (!userDoc) {
      res.status(401).json({ message: "User not found." });
    }

    const Orders = await sheet.read("Orders");

    // userDoc.shopId
    const FilteredOrders = Orders.filter((order) => {
      return order.shop_id?.includes(userDoc?.shopId?.toString());
    });

    // 1: Total Orders Today
    // 2: Pending Orders (Today)
    // 3: Delivered Orders (Today)
    // 4: Total Due Amount

    let totalOrdersToday = 0;
    let pendingOrdersToday = 0;
    let deliveredOrdersToday = 0;
    let totalDueAmount = 0;

    FilteredOrders.forEach((order) => {
      const orderDate = new Date(order.created_at);
      const today = new Date();

      if (orderDate.toDateString() === today.toDateString()) {
        totalOrdersToday++;

        if (order.status === "delivered") {
          deliveredOrdersToday++;
        } else {
          pendingOrdersToday++;
        }
      }

      if (!order.payment_status) {
        totalDueAmount += order.total_price - order.discount;
      }
    });

    res.status(200).json({
      totalOrdersToday,
      pendingOrdersToday,
      deliveredOrdersToday,
      totalDueAmount,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
