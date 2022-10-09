-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Jul 18, 2022 at 09:01 AM
-- Server version: 10.7.3-MariaDB-1:10.7.3+maria~focal
-- PHP Version: 8.0.19
SET
    SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

START TRANSACTION;

SET
    time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;

/*!40101 SET NAMES utf8mb4 */
;

--
-- Database: `GSS`
--
-- --------------------------------------------------------
--
-- Table structure for table `Branch`
--
CREATE TABLE `Branch` (
    `BranchId` int(11) NOT NULL,
    `Name` varchar(250) DEFAULT NULL,
    `Address` varchar(250) NOT NULL,
    `Details` varchar(250) NOT NULL,
    `IsActive` tinyint(4) NOT NULL DEFAULT 1,
    `InsertUtc` timestamp NOT NULL DEFAULT current_timestamp(),
    `UpdateUtc` timestamp NULL DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- --------------------------------------------------------
--
-- Table structure for table `BranchSchameEnrollment`
--
CREATE TABLE `BranchSchameEnrollment` (
    `BranchSchemeId` int(11) NOT NULL,
    `IsActive` tinyint(4) NOT NULL DEFAULT 0,
    `fk_branchId` int(11) DEFAULT NULL,
    `fk_schemeId` int(11) DEFAULT NULL,
    `InsertUtc` timestamp NOT NULL DEFAULT current_timestamp(),
    `UpdateUtc` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- --------------------------------------------------------
--
-- Table structure for table `Ledger`
--
CREATE TABLE `Ledger` (
    `LedgerId` int(11) NOT NULL,
    `fk_EnrollmentId` int(11) NOT NULL,
    `DueAmount` int(11) NOT NULL,
    `DueDate` timestamp NOT NULL DEFAULT current_timestamp(),
    `IsPaid` tinyint(4) NOT NULL COMMENT '0-Not Paid,1-paid,2-missed',
    `PaidDate` timestamp NULL DEFAULT NULL,
    `InstallmentNumber` int(11) NOT NULL,
    `GoldAccumulated` double DEFAULT NULL,
    `fk_UserId` int(11) DEFAULT NULL,
    `Mode` int(11) DEFAULT NULL COMMENT '1-mobile,2-web',
    `InsertUtc` timestamp NOT NULL DEFAULT current_timestamp(),
    `UpdatUtc` timestamp NULL DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- --------------------------------------------------------
--
-- Table structure for table `ModuleAccess`
--
CREATE TABLE `ModuleAccess` (
    `ModuleAccessId` int(11) NOT NULL,
    `ModuleName` varchar(100) NOT NULL,
    `ModuleAccessAlias` varchar(50) DEFAULT NULL,
    `CreateMode` tinyint(4) NOT NULL,
    `EditMode` tinyint(4) NOT NULL,
    `ReadMode` tinyint(4) NOT NULL,
    `DeleteMode` tinyint(4) NOT NULL,
    `fk_UserTypeId` int(11) NOT NULL,
    `InsertUtc` timestamp NOT NULL DEFAULT current_timestamp(),
    `UpdateUtc` timestamp NULL DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

--
-- Dumping data for table `ModuleAccess`
--
INSERT INTO
    `ModuleAccess` (
        `ModuleAccessId`,
        `ModuleName`,
        `ModuleAccessAlias`,
        `CreateMode`,
        `EditMode`,
        `ReadMode`,
        `DeleteMode`,
        `fk_UserTypeId`,
        `InsertUtc`,
        `UpdateUtc`
    )
VALUES
    (
        1,
        'Dashboard',
        'dashboard',
        1,
        1,
        1,
        1,
        1,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        2,
        'Dashboard',
        'dashboard',
        1,
        1,
        1,
        1,
        2,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        3,
        'Dashboard',
        'dashboard',
        0,
        1,
        0,
        0,
        3,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        4,
        'Schemes',
        'scheme',
        1,
        1,
        1,
        1,
        1,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        5,
        'Schemes',
        'scheme',
        1,
        1,
        1,
        1,
        2,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        6,
        'Schemes',
        'scheme',
        0,
        1,
        1,
        0,
        3,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        7,
        'Users',
        'user',
        1,
        1,
        1,
        1,
        1,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        8,
        'Users',
        'user',
        1,
        1,
        1,
        1,
        2,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        9,
        'Users',
        'user',
        0,
        1,
        1,
        0,
        3,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        10,
        'Branches',
        'branch',
        1,
        1,
        1,
        1,
        1,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        11,
        'Branches',
        'branch',
        1,
        1,
        1,
        1,
        2,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        12,
        'Branches',
        'branch',
        0,
        1,
        1,
        0,
        3,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        13,
        'Notifications',
        'notificationConfig',
        1,
        1,
        1,
        1,
        1,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        14,
        'Notifications',
        'notificationConfig',
        1,
        1,
        1,
        1,
        2,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        15,
        'Notifications',
        'notificationConfig',
        0,
        1,
        1,
        0,
        3,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        16,
        'SMS',
        'notificationConfig',
        1,
        1,
        1,
        1,
        1,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        17,
        'SMS',
        'notificationConfig',
        1,
        1,
        1,
        1,
        2,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        18,
        'SMS',
        'notificationConfig',
        0,
        1,
        1,
        0,
        3,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        19,
        'Scheme Enrollnment ',
        'schemeEnrollment ',
        1,
        1,
        1,
        1,
        1,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        20,
        'Scheme Enrollnment ',
        'schemeEnrollment ',
        1,
        1,
        1,
        1,
        2,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        21,
        'Scheme Enrollnment ',
        'schemeEnrollment ',
        1,
        1,
        1,
        0,
        3,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        22,
        'Redeem ',
        'redeem ',
        1,
        1,
        1,
        1,
        1,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        23,
        'Redeem ',
        'redeem ',
        1,
        1,
        1,
        1,
        2,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        24,
        'Redeem ',
        'redeem ',
        0,
        1,
        1,
        0,
        3,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        25,
        'RateCard ',
        'rateCard ',
        1,
        1,
        1,
        1,
        1,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        26,
        'RateCard ',
        'rateCard ',
        1,
        1,
        1,
        1,
        2,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        27,
        'RateCard ',
        'rateCard ',
        0,
        1,
        1,
        0,
        3,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        28,
        'Offers ',
        'offers ',
        1,
        1,
        1,
        1,
        1,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        29,
        'Offers ',
        'offers ',
        1,
        1,
        1,
        1,
        2,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        30,
        'Offers ',
        'offers ',
        0,
        1,
        1,
        0,
        3,
        '2022-06-20 08:28:00',
        NULL
    ),
    (
        31,
        'oAuth',
        'oAuth',
        0,
        0,
        1,
        0,
        1,
        '2022-07-11 10:24:54',
        NULL
    ),
    (
        32,
        'oAuth',
        'oAuth',
        0,
        0,
        1,
        0,
        2,
        '2022-07-11 10:25:17',
        NULL
    ),
    (
        33,
        'oAuth',
        'oAuth',
        0,
        0,
        1,
        0,
        3,
        '2022-07-11 10:25:17',
        NULL
    ),
    (
        37,
        'payment',
        'payment',
        1,
        1,
        1,
        1,
        3,
        '2022-07-17 04:44:44',
        NULL
    ),
    (
        38,
        'payment',
        'payment',
        1,
        1,
        1,
        1,
        2,
        '2022-07-17 04:45:26',
        NULL
    ),
    (
        39,
        'payment',
        'payment',
        1,
        1,
        1,
        1,
        1,
        '2022-07-17 04:45:26',
        NULL
    );

-- --------------------------------------------------------
--
-- Table structure for table `NotificationSMSConfig`
--
CREATE TABLE `NotificationSMSConfig` (
    `NotifiSmsConfigId` int(11) NOT NULL,
    `Type` tinyint(4) NOT NULL COMMENT '1- sms, 2- notification',
    `Title` varchar(50) NOT NULL,
    `Message` varchar(250) NOT NULL,
    `PublishedDate` timestamp NULL DEFAULT current_timestamp(),
    `fk_UserId` int(11) NOT NULL,
    `IsActive` tinyint(4) DEFAULT 1,
    `InsertUtc` timestamp NOT NULL DEFAULT current_timestamp(),
    `UpdateUtc` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- --------------------------------------------------------
--
-- Table structure for table `oAuth`
--
CREATE TABLE `oAuth` (
    `AuthId` int(11) NOT NULL,
    `UUID` binary(16) NOT NULL,
    `Hash` varchar(256) DEFAULT NULL,
    `fk_UserId` int(11) DEFAULT NULL,
    `InsertDate` timestamp NOT NULL DEFAULT current_timestamp(),
    `IsActive` tinyint(4) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- --------------------------------------------------------
--
-- Table structure for table `Offers`
--
CREATE TABLE `Offers` (
    `OfferId` int(11) NOT NULL,
    `Name` varchar(100) DEFAULT NULL,
    `Description` varchar(250) DEFAULT NULL,
    `OfferAmount` int(11) DEFAULT NULL,
    `KnowMore` varchar(250) NOT NULL,
    `IsActive` tinyint(4) NOT NULL DEFAULT 1,
    `UpdatedUtc` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    `InsertUtc` timestamp NULL DEFAULT current_timestamp()
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- --------------------------------------------------------
--
-- Table structure for table `OriganizationInformation`
--
CREATE TABLE `OriganizationInformation` (
    `OrganizationId` varchar(50) NOT NULL,
    `Name` varchar(100) NOT NULL,
    `Address` varchar(250) NOT NULL,
    `PrimaryColor` varchar(20) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

--
-- Triggers `OriganizationInformation`
--
DELIMITER $ $ CREATE TRIGGER `Organization_Information_Insert_UUID` BEFORE
INSERT
    ON `OriganizationInformation` FOR EACH ROW BEGIN
SET
    NEW.OrganizationId = UUID();

END $ $ DELIMITER;

-- --------------------------------------------------------
--
-- Table structure for table `RateCard`
--
CREATE TABLE `RateCard` (
    `RateCardId` int(11) NOT NULL,
    `Name` varchar(50) NOT NULL,
    `Price` double NOT NULL,
    `Date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    `InsertUtc` timestamp NOT NULL DEFAULT current_timestamp(),
    `UpdateUtc` timestamp NULL DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

--
-- Dumping data for table `RateCard`
--
INSERT INTO
    `RateCard` (
        `RateCardId`,
        `Name`,
        `Price`,
        `Date`,
        `InsertUtc`,
        `UpdateUtc`
    )
VALUES
    (
        1,
        'gold',
        4700,
        '2022-07-18 00:00:00',
        '2022-05-23 04:24:23',
        NULL
    );

-- --------------------------------------------------------
--
-- Table structure for table `Redeem`
--
CREATE TABLE `Redeem` (
    `RedeemId` int(11) NOT NULL,
    `fk_SchemeEnrollmentId` int(11) NOT NULL,
    `RedeemDate` timestamp NOT NULL DEFAULT current_timestamp(),
    `RedeemAmount` int(11) NOT NULL,
    `InsertUtc` timestamp NOT NULL DEFAULT current_timestamp(),
    `UpdateUtc` timestamp NULL DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- --------------------------------------------------------
--
-- Table structure for table `RedeemErollment`
--
CREATE TABLE `RedeemErollment` (
    `RedeemEnrollID` int(11) NOT NULL,
    `fk_RedeemId` int(11) DEFAULT NULL,
    `fk_EnrollmentId` int(11) DEFAULT NULL,
    `fk_RateCardId` int(11) DEFAULT NULL,
    `InsertUtc` timestamp NOT NULL DEFAULT current_timestamp(),
    `UpdateUtc` timestamp NULL DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- --------------------------------------------------------
--
-- Table structure for table `SchemeEnrollment`
--
CREATE TABLE `SchemeEnrollment` (
    `EnrollmentId` int(11) NOT NULL,
    `fk_UserId` int(11) NOT NULL,
    `fk_SchemaId` int(11) NOT NULL,
    `Is_Redeemed` tinyint(4) NOT NULL,
    `IsActive` tinyint(4) NOT NULL DEFAULT 0,
    `InitialSchemeName` varchar(100) DEFAULT NULL,
    `InitialSchemeDescription` varchar(1000) DEFAULT NULL,
    `InitialInstallmentAmount` int(11) DEFAULT NULL,
    `RemainingInstallments` int(11) NOT NULL,
    `AccGold` double DEFAULT NULL,
    `fk_RateCardId` int(11) NOT NULL,
    `EnrollDate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    `InsertUtc` timestamp NOT NULL DEFAULT current_timestamp(),
    `UpdateUtc` timestamp NULL DEFAULT NULL,
    `RedeemDate` timestamp NULL DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- --------------------------------------------------------
--
-- Table structure for table `SchemeList`
--
CREATE TABLE `SchemeList` (
    `SchemaId` int(11) NOT NULL,
    `Name` varchar(100) NOT NULL,
    `Description` varchar(1000) NOT NULL,
    `InstallmentAmount` int(11) NOT NULL,
    `NumUsers` int(11) DEFAULT NULL,
    `GrossAmount` int(11) DEFAULT NULL,
    `Tenure` int(11) NOT NULL,
    `GoldRateType` tinyint(4) NOT NULL COMMENT '0 - enroll, 1- redeem',
    `CutOffDays` int(11) DEFAULT NULL,
    `IsActive` tinyint(4) NOT NULL DEFAULT 1,
    `CreatedBy` tinyint(4) DEFAULT NULL,
    `UpdatedBy` tinyint(4) DEFAULT NULL,
    `InsertUtc` timestamp NOT NULL DEFAULT current_timestamp(),
    `UpdateUtc` timestamp NULL DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- --------------------------------------------------------
--
-- Table structure for table `Transaction`
--
CREATE TABLE `Transaction` (
    `TransactionId` int(11) NOT NULL,
    `TransactionDate` timestamp NULL DEFAULT current_timestamp(),
    `Details` varchar(250) DEFAULT NULL,
    `fk_LedgerId` int(11) NOT NULL,
    `InsertUtc` timestamp NOT NULL DEFAULT current_timestamp(),
    `UpdateUtc` timestamp NULL DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- --------------------------------------------------------
--
-- Table structure for table `Users`
--
CREATE TABLE `Users` (
    `UserId` int(11) NOT NULL,
    `FirstName` varchar(50) DEFAULT NULL,
    `LastName` varchar(50) DEFAULT NULL,
    `Email` varchar(50) DEFAULT NULL,
    `NumSchEnroll` int(11) DEFAULT NULL,
    `PanNumber` varchar(100) DEFAULT NULL,
    `Mobile` varchar(20) DEFAULT NULL,
    `Address` varchar(100) DEFAULT NULL,
    `sessionId` varchar(100) DEFAULT NULL,
    `lastLoggedIn` timestamp NULL DEFAULT NULL,
    `IsActive` tinyint(4) NOT NULL DEFAULT 1,
    `fk_BranchId` int(11) DEFAULT NULL,
    `InsertUtc` timestamp NOT NULL DEFAULT current_timestamp(),
    `UpdateUtc` timestamp NULL DEFAULT NULL,
    `fk_UserTypeId` int(11) DEFAULT NULL,
    `CreatedBy` tinyint(4) DEFAULT NULL,
    `UpdatedBy` tinyint(4) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- --------------------------------------------------------
--
-- Table structure for table `UserType`
--
CREATE TABLE `UserType` (
    `UserTypeId` int(11) NOT NULL,
    `Title` varchar(100) NOT NULL,
    `Alias` varchar(200) DEFAULT NULL,
    `IsActive` tinyint(4) NOT NULL DEFAULT 1,
    `Description` varchar(250) NOT NULL,
    `WebAccess` tinyint(4) NOT NULL DEFAULT 0,
    `MobileAccess` tinyint(4) NOT NULL DEFAULT 0,
    `InsertUtc` timestamp NOT NULL DEFAULT current_timestamp(),
    `UpdateUtc` timestamp NULL DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

--
-- Dumping data for table `UserType`
--
INSERT INTO
    `UserType` (
        `UserTypeId`,
        `Title`,
        `Alias`,
        `IsActive`,
        `Description`,
        `WebAccess`,
        `MobileAccess`,
        `InsertUtc`,
        `UpdateUtc`
    )
VALUES
    (
        1,
        'Super Admin',
        'superAdmin',
        1,
        'Have full access',
        1,
        0,
        '2022-05-16 06:32:28',
        NULL
    ),
    (
        2,
        'Admin',
        'admin',
        1,
        'Have full access',
        1,
        0,
        '2022-05-16 06:32:31',
        NULL
    ),
    (
        3,
        'Customer',
        'customer',
        1,
        'End Customer',
        0,
        1,
        '2022-05-19 16:33:52',
        NULL
    );

--
-- Indexes for dumped tables
--
--
-- Indexes for table `Branch`
--
ALTER TABLE
    `Branch`
ADD
    PRIMARY KEY (`BranchId`);

--
-- Indexes for table `BranchSchameEnrollment`
--
ALTER TABLE
    `BranchSchameEnrollment`
ADD
    PRIMARY KEY (`BranchSchemeId`),
ADD
    KEY `Branch_BranchSchemeEnroll` (`fk_branchId`),
ADD
    KEY `Schema_BranchSchemeEnroll` (`fk_schemeId`);

--
-- Indexes for table `Ledger`
--
ALTER TABLE
    `Ledger`
ADD
    PRIMARY KEY (`LedgerId`),
ADD
    KEY `SchemeEnrollment_LedgerID` (`fk_EnrollmentId`);

--
-- Indexes for table `ModuleAccess`
--
ALTER TABLE
    `ModuleAccess`
ADD
    PRIMARY KEY (`ModuleAccessId`);

--
-- Indexes for table `NotificationSMSConfig`
--
ALTER TABLE
    `NotificationSMSConfig`
ADD
    PRIMARY KEY (`NotifiSmsConfigId`);

--
-- Indexes for table `oAuth`
--
ALTER TABLE
    `oAuth`
ADD
    PRIMARY KEY (`AuthId`);

--
-- Indexes for table `Offers`
--
ALTER TABLE
    `Offers`
ADD
    PRIMARY KEY (`OfferId`);

--
-- Indexes for table `RateCard`
--
ALTER TABLE
    `RateCard`
ADD
    PRIMARY KEY (`RateCardId`);

--
-- Indexes for table `Redeem`
--
ALTER TABLE
    `Redeem`
ADD
    PRIMARY KEY (`RedeemId`);

--
-- Indexes for table `RedeemErollment`
--
ALTER TABLE
    `RedeemErollment`
ADD
    PRIMARY KEY (`RedeemEnrollID`);

--
-- Indexes for table `SchemeEnrollment`
--
ALTER TABLE
    `SchemeEnrollment`
ADD
    PRIMARY KEY (`EnrollmentId`),
ADD
    KEY `SchemeId_fk_schemeId` (`fk_SchemaId`),
ADD
    KEY `UserId_fkUserdid` (`fk_UserId`);

--
-- Indexes for table `SchemeList`
--
ALTER TABLE
    `SchemeList`
ADD
    PRIMARY KEY (`SchemaId`);

--
-- Indexes for table `Transaction`
--
ALTER TABLE
    `Transaction`
ADD
    PRIMARY KEY (`TransactionId`),
ADD
    KEY `Ledger_Transaction` (`fk_LedgerId`);

--
-- Indexes for table `Users`
--
ALTER TABLE
    `Users`
ADD
    PRIMARY KEY (`UserId`),
ADD
    UNIQUE KEY `Mobile` (`Mobile`),
ADD
    KEY `BranchId_fkBranchId` (`fk_BranchId`),
ADD
    KEY `Branch_fkUserType` (`fk_UserTypeId`);

--
-- Indexes for table `UserType`
--
ALTER TABLE
    `UserType`
ADD
    PRIMARY KEY (`UserTypeId`);

--
-- AUTO_INCREMENT for dumped tables
--
--
-- AUTO_INCREMENT for table `Branch`
--
ALTER TABLE
    `Branch`
MODIFY
    `BranchId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `BranchSchameEnrollment`
--
ALTER TABLE
    `BranchSchameEnrollment`
MODIFY
    `BranchSchemeId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Ledger`
--
ALTER TABLE
    `Ledger`
MODIFY
    `LedgerId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ModuleAccess`
--
ALTER TABLE
    `ModuleAccess`
MODIFY
    `ModuleAccessId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `NotificationSMSConfig`
--
ALTER TABLE
    `NotificationSMSConfig`
MODIFY
    `NotifiSmsConfigId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `oAuth`
--
ALTER TABLE
    `oAuth`
MODIFY
    `AuthId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Offers`
--
ALTER TABLE
    `Offers`
MODIFY
    `OfferId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `RateCard`
--
ALTER TABLE
    `RateCard`
MODIFY
    `RateCardId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Redeem`
--
ALTER TABLE
    `Redeem`
MODIFY
    `RedeemId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `RedeemErollment`
--
ALTER TABLE
    `RedeemErollment`
MODIFY
    `RedeemEnrollID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `SchemeEnrollment`
--
ALTER TABLE
    `SchemeEnrollment`
MODIFY
    `EnrollmentId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `SchemeList`
--
ALTER TABLE
    `SchemeList`
MODIFY
    `SchemaId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Transaction`
--
ALTER TABLE
    `Transaction`
MODIFY
    `TransactionId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE
    `Users`
MODIFY
    `UserId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `UserType`
--
ALTER TABLE
    `UserType`
MODIFY
    `UserTypeId` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--
--
-- Constraints for table `BranchSchameEnrollment`
--
ALTER TABLE
    `BranchSchameEnrollment`
ADD
    CONSTRAINT `Branch_BranchSchemeEnroll` FOREIGN KEY (`fk_branchId`) REFERENCES `Branch` (`BranchId`) ON DELETE CASCADE ON UPDATE
SET
    NULL,
ADD
    CONSTRAINT `Schema_BranchSchemeEnroll` FOREIGN KEY (`fk_schemeId`) REFERENCES `SchemeList` (`SchemaId`) ON DELETE CASCADE;

--
-- Constraints for table `Ledger`
--
ALTER TABLE
    `Ledger`
ADD
    CONSTRAINT `SchemeEnrollment_LedgerID` FOREIGN KEY (`fk_EnrollmentId`) REFERENCES `SchemeEnrollment` (`EnrollmentId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `SchemeEnrollment`
--
ALTER TABLE
    `SchemeEnrollment`
ADD
    CONSTRAINT `SchemeId_fk_schemeId` FOREIGN KEY (`fk_SchemaId`) REFERENCES `SchemeList` (`SchemaId`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD
    CONSTRAINT `UserId_fkUserdid` FOREIGN KEY (`fk_UserId`) REFERENCES `Users` (`UserId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Transaction`
--
ALTER TABLE
    `Transaction`
ADD
    CONSTRAINT `Ledger_Transaction` FOREIGN KEY (`fk_LedgerId`) REFERENCES `Ledger` (`LedgerId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Users`
--
ALTER TABLE
    `Users`
ADD
    CONSTRAINT `BranchId_fkBranchId` FOREIGN KEY (`fk_BranchId`) REFERENCES `Branch` (`BranchId`),
ADD
    CONSTRAINT `Branch_fkUserType` FOREIGN KEY (`fk_UserTypeId`) REFERENCES `UserType` (`UserTypeId`);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;