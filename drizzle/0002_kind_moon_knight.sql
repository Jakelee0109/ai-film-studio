ALTER TABLE `scenes` MODIFY COLUMN `description` text NOT NULL;--> statement-breakpoint
ALTER TABLE `scenes` MODIFY COLUMN `conceptArtUrl` text NOT NULL;--> statement-breakpoint
ALTER TABLE `storyboards` MODIFY COLUMN `cameraAngle` varchar(100);--> statement-breakpoint
ALTER TABLE `storyboards` MODIFY COLUMN `description` text;