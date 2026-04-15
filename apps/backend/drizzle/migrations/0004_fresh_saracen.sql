CREATE TABLE `project_resources` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`user_id` text NOT NULL,
	`prefix` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `project_resource_projectId_idx` ON `project_resources` (`project_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `project_resource_project_prefix_unique` ON `project_resources` (`project_id`,`prefix`);