CREATE TABLE `bot_context` (
	`id` integer PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`assistant_id` text NOT NULL,
	`thread_id` text NOT NULL,
	`run_id` text,
	`message_read_at` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `bot_setting` (
	`id` integer PRIMARY KEY NOT NULL,
	`assistant_id` text NOT NULL
);
