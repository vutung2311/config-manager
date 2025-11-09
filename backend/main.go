package main

import (
	_ "config-manager/pb_migrations" // Import migrations to register them
	"log/slog"
	"os"
	"path"
	"regexp"
	"runtime"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"github.com/spf13/cobra"
)

func makeApp() *pocketbase.PocketBase {
	isDev := os.Getenv("PB_DEV") == "true"

	app := pocketbase.NewWithConfig(
		pocketbase.Config{
			DefaultDev: isDev,
		},
	)

	return app
}

func configMigration(app core.App, cmd *cobra.Command) {
	isDev := os.Getenv("PB_DEV") == "true"
	_, curFile, _, _ := runtime.Caller(0)
	curDir := path.Dir(curFile)
	migratecmd.MustRegister(
		app,
		cmd,
		migratecmd.Config{
			Automigrate: isDev,
			Dir:         path.Join(curDir, "pb_migrations"),
		},
	)
}

func configHooks(app core.App) {
	app.OnRecordCreateRequest("configuration_templates").BindFunc(validateConfigurationTemplateName)
	app.OnRecordUpdateRequest("configuration_templates").BindFunc(validateConfigurationTemplateName)
}

func validateConfigurationTemplateName(e *core.RecordRequestEvent) error {
	name := e.Record.GetString("name")

	// Validate that name contains only uppercase letters and underscores
	validNamePattern := regexp.MustCompile(`^[A-Z_1-9]+$`)
	if !validNamePattern.MatchString(name) {
		return e.BadRequestError(
			"configuration template name must contain only uppercase letters and underscores",
			nil,
		)
	}

	return e.Next()
}

func main() {
	app := makeApp()
	configMigration(app, app.RootCmd)
	configHooks(app)

	// Bootstrap the app (initializes database and runs migrations)
	slog.Info("bootstrapping PocketBase")
	if err := app.Bootstrap(); err != nil {
		slog.Error("failed to bootstrap app", "error", err)
		os.Exit(1)
	}
	slog.Info("bootstrap completed successfully")

	slog.Info("starting PocketBase server")
	if err := app.Start(); err != nil {
		slog.Error("failed to start PocketBase server", "error", err)
		os.Exit(1)
	}
}
