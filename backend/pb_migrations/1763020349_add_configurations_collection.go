package pb_migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/types"
)

func init() {
	m.Register(func(app core.App) error {
		// Check if collection already exists
		existing, err := app.FindCollectionByNameOrId("configurations")
		if err == nil && existing != nil {
			return nil // collection already exists
		}

		// create app_configurations collection
		collection := core.NewBaseCollection("configurations")

		// Add name field
		nameField := &core.TextField{
			Name:     "name",
			Required: true,
		}
		collection.Fields.Add(nameField)

		// Add JSON field
		jsonField := &core.JSONField{
			Name:     "data",
			Required: true,
		}
		collection.Fields.Add(jsonField)

		// Add game_id field (varchar 255)
		gameIdField := &core.TextField{
			Name:     "game_id",
			Max:      255,
			Required: true,
		}
		collection.Fields.Add(gameIdField)

		// Add game_id field (varchar 255)
		latestField := &core.BoolField{
			Name:     "is_latest",
			Required: true,
		}
		collection.Fields.Add(latestField)

		// Add created timestamp field (auto-populated on create)
		createdField := &core.AutodateField{
			Name:     "created",
			OnCreate: true,
			OnUpdate: false,
		}
		collection.Fields.Add(createdField)

		// Add updated timestamp field (auto-populated on create and update)
		updatedField := &core.AutodateField{
			Name:     "updated",
			OnCreate: true,
			OnUpdate: true,
		}
		collection.Fields.Add(updatedField)

		// Add indexes for sorting
		collection.AddIndex("idx_configurations_created", false, "created", "")
		collection.AddIndex("idx_configurations_unique_name_game_id_is_latest", true, "name,game_id,is_latest", "")

		// Set access rules (only authenticated users can access)
		collection.ListRule = types.Pointer("@request.auth.id != ''")
		collection.ViewRule = types.Pointer("@request.auth.id != ''")
		collection.CreateRule = types.Pointer("@request.auth.id != ''")
		collection.UpdateRule = types.Pointer("@request.auth.id != ''")
		collection.DeleteRule = types.Pointer("@request.auth.id != ''")

		if err := app.Save(collection); err != nil {
			return err
		}

		// Add foreign key constraint to game
		_, err = app.DB().NewQuery(`
			ALTER TABLE configurations
			ADD CONSTRAINT fk_configurations_game_id
			FOREIGN KEY (game_id) REFERENCES games(id)
			ON DELETE CASCADE ON UPDATE CASCADE
		`).Execute()
		return err
		// Add foreign key constraint to config template
		_, err = app.DB().NewQuery(`
				ALTER TABLE configurations
				ADD CONSTRAINT fk_configurations_template_id
				FOREIGN KEY (template_id) REFERENCES configuration_templates(id)
				ON DELETE CASCADE ON UPDATE CASCADE
			`).Execute()
		return err

	}, func(app core.App) error {
		// Remove foreign key constraint first
		_, err := app.DB().NewQuery(`
			ALTER TABLE configurations
			DROP CONSTRAINT IF EXISTS fk_configurations_game_id
		`).Execute()
		if err != nil {
			return err
		}
		// Remove foreign key constraint first
		_, err = app.DB().NewQuery(`
			ALTER TABLE configurations
			DROP CONSTRAINT IF EXISTS fk_configurations_template_id
		`).Execute()
		if err != nil {
			return err
		}

		// remove app_configurations collection
		collection, err := app.FindCollectionByNameOrId("configurations")
		if err != nil {
			return nil // collection doesn't exist, nothing to remove
		}

		return app.Delete(collection)
	})
}
