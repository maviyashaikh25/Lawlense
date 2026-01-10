const User = require("../models/User");
const Document = require("../models/Document");

// Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const documentCount = await Document.countDocuments({ uploadedBy: req.user.id });

    // Format storage (simple conversion to MB for JSON, or send bytes)
    const storageMB = (user.storageUsed / (1024 * 1024)).toFixed(2);

    res.status(200).json({
      totalDocuments: documentCount,
      aiQueriesUsed: user.aiQueriesUsed,
      storageUsed: storageMB + " MB",
      // Simple logic for activity: "Active" if docs > 0 else "Inactive"
      recentActivity: documentCount > 0 ? "Active" : "Inactive", 
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};
