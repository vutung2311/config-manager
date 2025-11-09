package pb_migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/types"
)

const advertisementsPlacementsCollectionName = "advertisements_placements"

func init() {
	m.Register(func(app core.App) error {
		// Check if collection already exists
		existing, err := app.FindCollectionByNameOrId(advertisementsPlacementsCollectionName)
		if err == nil && existing != nil {
			return nil // collection already exists
		}

		// create configuration_templates collection
		collection := core.NewBaseCollection(advertisementsPlacementsCollectionName)

		// Add advertisement_id relation field that references advertisement_configs
		existing, err = app.FindCollectionByNameOrId(advertisementConfigsCollectionName)
		if err != nil {
			return err
		}
		advertisementIdField := &core.RelationField{
			Name:          "advertisement_id",
			Required:      true,
			CollectionId:  existing.Id,
			CascadeDelete: true,
		}
		collection.Fields.Add(advertisementIdField)

		// Add placement_id field with predefined options
		placementIdField := &core.SelectField{
			Name:     "placement_id",
			Required: true,
			Values: []string{
				"AppReady",
				"LevelStart",
				"Button/Undo/Click",
				"Button/Hint/Click",
				"Button/Shuffle/Click",
				"Button/Revive/Click",
				"LevelProgress_50",
				"Screen/NoMoreMove/Open",
				"Screen/LevelComplete/Open",
			},
		}
		collection.Fields.Add(placementIdField)

		// Add advertisement placement configuration fields
		adFormatField := &core.NumberField{
			Name: "ad_format",
		}
		collection.Fields.Add(adFormatField)

		actionField := &core.NumberField{
			Name: "action",
		}
		collection.Fields.Add(actionField)

		minLevelField := &core.NumberField{
			Name: "min_level",
		}
		collection.Fields.Add(minLevelField)

		timeBetweenField := &core.NumberField{
			Name: "time_between",
		}
		collection.Fields.Add(timeBetweenField)

		showLoadingField := &core.BoolField{
			Name: "show_loading",
		}
		collection.Fields.Add(showLoadingField)

		timeOutField := &core.NumberField{
			Name: "time_out",
		}
		collection.Fields.Add(timeOutField)

		retryField := &core.NumberField{
			Name: "retry",
		}
		collection.Fields.Add(retryField)

		showAdNoticeField := &core.BoolField{
			Name: "show_ad_notice",
		}
		collection.Fields.Add(showAdNoticeField)

		delayTimeField := &core.NumberField{
			Name: "delay_time",
		}
		collection.Fields.Add(delayTimeField)

		customAdUnitIdField := &core.TextField{
			Name: "custom_ad_unit_id",
		}
		collection.Fields.Add(customAdUnitIdField)

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
		collection.AddIndex("idx_advertisement_placements_created", false, "created", "")
		collection.AddIndex("idx_advertisement_placements_advertisement_id", false, "advertisement_id", "")
		collection.AddIndex("idx_advertisement_placements_placement_id", false, "placement_id", "")

		// Set access rules (only authenticated users can access)
		collection.ListRule = types.Pointer("@request.auth.id != ''")
		collection.ViewRule = types.Pointer("@request.auth.id != ''")
		collection.CreateRule = types.Pointer("@request.auth.id != ''")
		collection.UpdateRule = types.Pointer("@request.auth.id != ''")
		collection.DeleteRule = types.Pointer("@request.auth.id != ''")

		return app.Save(collection)
	}, func(app core.App) error {
		// remove configuration_templates collection
		collection, err := app.FindCollectionByNameOrId(advertisementsPlacementsCollectionName)
		if err != nil {
			return nil // collection doesn't exist, nothing to remove
		}

		return app.Delete(collection)
	})
}
