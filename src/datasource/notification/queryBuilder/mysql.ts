class Queryhelper {
  public insertNewNoticiationConfig(
    type,
    title,
    message,
    publishedDate,
    userId
  ) {
    let query = `INSERT INTO NotificationSMSConfig(Type, Title, Message, PublishedDate, fk_UserId) 
    VALUES ('${type}','${title}','${message}','${publishedDate}','${userId}');`;
    return query;
  }

  public updateNotificationConfig(
    NotifiSmsConfigId,
    type,
    title,
    message,
    publishedDate,
    userId
  ) {
    let updateValue = "";
    if (type) {
      if (updateValue) {
        updateValue += `, Type="${type}"`;
      } else {
        updateValue = `Type="${type}"`;
      }
    }
    if (title) {
      if (updateValue) {
        updateValue += `, Title="${title}"`;
      } else {
        updateValue = `Title="${title}"`;
      }
    }
    if (message) {
      if (updateValue) {
        updateValue += `, Message="${message}"`;
      } else {
        updateValue = `Message="${message}"`;
      }
    }
    if (publishedDate) {
      if (updateValue) {
        updateValue += `, PublishedDate="${publishedDate}"`;
      } else {
        updateValue = `PublishedDate="${publishedDate}"`;
      }
    }
    if (userId) {
      if (updateValue) {
        updateValue += `, fk_UserId="${userId}"`;
      } else {
        updateValue = `fk_UserId="${userId}"`;
      }
    }
    let query = `UPDATE NotificationSMSConfig SET ${updateValue} WHERE NotifiSmsConfigId = ${NotifiSmsConfigId}`;
    return query;
  }

  public deleteNotificationConfig(notificationConfigId, userId) {
    let query = `UPDATE NotificationSMSConfig SET IsActive = 0 ,fk_UserId="${userId}" WHERE NotifiSmsConfigId = '${notificationConfigId}';`;
    return query;
  }

  public getNotificationConfig(
    fromDate,
    toDate,
    type,
    search,
    notificationConfigId
  ) {
    let whereCondition = "IsActive = 1";
    if (fromDate && toDate) {
      whereCondition += ` AND PublishedDate >= '${fromDate}' && PublishedDate <= '${toDate}'`;
    }
    if (notificationConfigId) {
      whereCondition += ` AND NotifiSmsConfigId = '${notificationConfigId}'`;
    }
    if (type) {
      whereCondition += ` AND Type = ${type}`;
    }
    if (search) {
      whereCondition += ` AND (Title LIKE '%${search}%' || Message LIKE '%${search}%')`;
    }
    let query = `SELECT 
    NotifiSmsConfigId AS notificationConfigId,
    CASE 
    WHEN Type = 1 THEN "Notification"
    WHEN Type = 2 THEN "SMS" 
    END AS type , Title AS title, Message AS message, DATE_FORMAT(PublishedDate, '%Y-%m-%dT%H:%i:%s') AS publishedDate  
    FROM NotificationSMSConfig WHERE ${whereCondition};
    SELECT COUNT(*) AS count FROM NotificationSMSConfig WHERE ${whereCondition};`;
    return query;
  }
}

export const queryhelper = new Queryhelper();
