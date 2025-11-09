package pb_migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/types"
)

func init() {
	m.Register(func(app core.App) error {
		// Check if collection already exists
		existing, err := app.FindCollectionByNameOrId("games")
		if err == nil && existing != nil {
			return nil // collection already exists
		}

		// create configuration_templates collection
		collection := core.NewBaseCollection("games")

		// Add name field
		nameField := &core.TextField{
			Name:     "game_id",
			Required: true,
		}
		collection.Fields.Add(nameField)

		// Add created timestamp field (auto-populated on create)
		createdField := &core.AutodateField{
			Name:     "created",
			OnCreate: true,
			OnUpdate: false,
		}
		collection.Fields.Add(createdField)

		// Add indexes for sorting
		collection.AddIndex("idx_games_created", false, "created", "")

		// Set access rules (only authenticated users can access)
		collection.ListRule = types.Pointer("@request.auth.id != ''")
		collection.ViewRule = types.Pointer("@request.auth.id != ''")
		collection.CreateRule = types.Pointer("@request.auth.id != ''")
		collection.UpdateRule = types.Pointer("@request.auth.id != ''")
		collection.DeleteRule = types.Pointer("@request.auth.id != ''")

		return app.Save(collection)
	}, func(app core.App) error {
		// remove configuration_templates collection
		collection, err := app.FindCollectionByNameOrId("games")
		if err != nil {
			return nil // collection doesn't exist, nothing to remove
		}

		return app.Delete(collection)
	})
}
