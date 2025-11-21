CREATE TABLE `audios` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`audioUrl` text NOT NULL,
	`audioType` enum('voiceover','bgm','sfx') NOT NULL,
	`duration` int,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `audios_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `characters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`imageUrl` text,
	`loraModelUrl` text,
	`traits` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `characters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `creditTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`amount` int NOT NULL,
	`transactionType` enum('purchase','subscription','usage','refund') NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `creditTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `posters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`imageUrl` text NOT NULL,
	`layout` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `posters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`status` enum('draft','in_progress','completed') NOT NULL DEFAULT 'draft',
	`coverImage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scenes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`conceptArtUrl` text,
	`panoramaUrl` text,
	`props` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `scenes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scripts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`content` text NOT NULL,
	`formattedContent` text,
	`characters` text,
	`version` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `scripts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `storyboards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`scriptId` int NOT NULL,
	`sceneNumber` int NOT NULL,
	`imageUrl` text NOT NULL,
	`cameraAngle` varchar(100),
	`description` text,
	`sortOrder` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `storyboards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `supportTickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`subject` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`status` enum('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
	`priority` enum('low','medium','high') NOT NULL DEFAULT 'medium',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `supportTickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `videos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`storyboardId` int,
	`videoUrl` text NOT NULL,
	`thumbnailUrl` text,
	`duration` int,
	`generationType` enum('i2v','t2v') NOT NULL,
	`status` enum('processing','completed','failed') NOT NULL DEFAULT 'processing',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `videos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `credits` int DEFAULT 10 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionTier` enum('free','creator','studio') DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionExpiry` timestamp;