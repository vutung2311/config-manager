package pb_migrations

import (
	"log/slog"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	const adminEmail = "admin@sun.studio"
	const userEmail = "moderator@sun.studio"
	m.Register(func(app core.App) error {
		// Migration logic: Create default admin user
		slog.Info("running migration", "migration", "create_admin")

		// Check if admin already exists to avoid duplicates
		record, err := app.FindAuthRecordByEmail(core.CollectionNameSuperusers, adminEmail)
		if err == nil && record != nil {
			slog.Info("migration completed", "migration", "create_admin", "reason", "admin user already exists")
			return nil
		}

		// Get the superusers collection
		superusers, err := app.FindCollectionByNameOrId(core.CollectionNameSuperusers)
		if err != nil {
			slog.Error("failed to find superusers collection", "error", err)
			return err
		}

		// Create the admin user record
		record = core.NewRecord(superusers)
		record.Set("email", adminEmail)
		record.Set("password", "adminpassword123")
		record.Set("verified", true)

		// Save the record
		if err := app.Save(record); err != nil {
			slog.Error("failed to create admin user in migration", "error", err)
			return err
		}

		// Check if admin already exists to avoid duplicates
		record, err = app.FindAuthRecordByEmail("users", userEmail)
		if err == nil && record != nil {
			slog.Info("migration completed", "migration", "create_user", "reason", "user already exists")
			return nil
		}

		// Get the superusers collection
		users, err := app.FindCollectionByNameOrId("users")
		if err != nil {
			slog.Error("failed to find users collection", "error", err)
			return err
		}

		// Create the admin user record
		record = core.NewRecord(users)
		record.Set("email", userEmail)
		record.Set("password", "userpassword123")
		record.Set("verified", true)

		// Save the record
		if err := app.Save(record); err != nil {
			slog.Error("failed to create admin user in migration", "error", err)
			return err
		}

		slog.Info("migration completed", "migration", "create_admin", "email", adminEmail)

		return nil
	}, func(app core.App) error {
		// Rollback logic: Remove the admin user we created
		slog.Info("rolling back migration", "migration", "create_admin")

		record, err := app.FindAuthRecordByEmail(core.CollectionNameSuperusers, adminEmail)
		if err != nil {
			slog.Warn("failed to find admin user during rollback", "error", err)
			return nil
		}

		if record != nil {
			if err := app.Delete(record); err != nil {
				slog.Warn("failed to delete admin user during rollback", "error", err)
			}
		}
		record, err = app.FindAuthRecordByEmail("users", userEmail)
		if err != nil {
			slog.Warn("failed to find user during rollback", "error", err)
			return nil
		}
		if record != nil {
			if err := app.Delete(record); err != nil {
				slog.Warn("failed to delete user during rollback", "error", err)
			}
		}

		slog.Info("rollback completed", "migration", "create_admin")

		return nil
	})
}
