const express = require("express");

const NotificationController = require("../controllers/notifications");

const router = express.Router();

router.get("",
    NotificationController.getNotifications
);

router.post("",
    NotificationController.addNotification
);

router.put("/:id",
    NotificationController.updateNotification
);

router.get("/:id",
    NotificationController.getNotification
);

router.get("/:postid/:kind",
    NotificationController.getNotificationByPostAndKind
);

router.delete("/:id/:userid",
    NotificationController.deleteNotification
);

module.exports = router;