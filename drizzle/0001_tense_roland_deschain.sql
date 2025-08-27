CREATE TABLE `data` (
	`id` int NOT NULL,
	`user_id` int NOT NULL,
	`email` varchar(256) NOT NULL,
	`ip` varchar(45),
	`lastLogin` timestamp,
	`IpLocation` varchar(256),
	`userAgent` varchar(256),
	`platform` varchar(256),
	CONSTRAINT `data_id` PRIMARY KEY(`id`),
	CONSTRAINT `data_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `username` varchar(256);--> statement-breakpoint
ALTER TABLE `users` ADD `userAliasName` varchar(256);--> statement-breakpoint
ALTER TABLE `data` ADD CONSTRAINT `data_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `data` ADD CONSTRAINT `data_email_users_email_fk` FOREIGN KEY (`email`) REFERENCES `users`(`email`) ON DELETE no action ON UPDATE no action;