package pb_migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/types"
)

const advertisementConfigsCollectionName = "advertisement_configs"

func init() {
	m.Register(func(app core.App) error {
		// Check if collection already exists
		existing, err := app.FindCollectionByNameOrId(advertisementConfigsCollectionName)
		if err == nil && existing != nil {
			return nil // collection already exists
		}

		// create configuration_templates collection
		collection := core.NewBaseCollection(advertisementConfigsCollectionName)

		// Add name field
		nameField := &core.TextField{
			Name:     "name",
			Required: true,
		}
		collection.Fields.Add(nameField)

		// Add name field
		experimentID := &core.TextField{
			Name:     "experiment_id",
			Required: true,
		}
		collection.Fields.Add(experimentID)

		gameId := &core.JSONField{
			Name:     "game_id",
			Required: true,
		}
		collection.Fields.Add(gameId)

		// Add advertisement configuration fields
		bannerAdUnitIdField := &core.TextField{
			Name: "banner_ad_unit_id",
		}
		collection.Fields.Add(bannerAdUnitIdField)

		interstitialAdUnitIdField := &core.TextField{
			Name: "interstitial_ad_unit_id",
		}
		collection.Fields.Add(interstitialAdUnitIdField)

		rewardedAdUnitIdField := &core.TextField{
			Name: "rewarded_ad_unit_id",
		}
		collection.Fields.Add(rewardedAdUnitIdField)

		autoHideBannerField := &core.BoolField{
			Name: "auto_hide_banner",
		}
		collection.Fields.Add(autoHideBannerField)

		bannerPositionField := &core.NumberField{
			Name: "banner_position",
		}
		collection.Fields.Add(bannerPositionField)

		bannerRefreshRateField := &core.NumberField{
			Name: "banner_refresh_rate",
		}
		collection.Fields.Add(bannerRefreshRateField)

		bannerMemoryThresholdField := &core.NumberField{
			Name: "banner_memory_threshold",
		}
		collection.Fields.Add(bannerMemoryThresholdField)

		destroyBannerOnLowMemoryField := &core.BoolField{
			Name: "destroy_banner_on_low_memory",
		}
		collection.Fields.Add(destroyBannerOnLowMemoryField)

		preloadInterstitialField := &core.BoolField{
			Name: "preload_interstitial",
		}
		collection.Fields.Add(preloadInterstitialField)

		preloadRewardedField := &core.BoolField{
			Name: "preload_rewarded",
		}
		collection.Fields.Add(preloadRewardedField)

		enableConsentFlowField := &core.BoolField{
			Name: "enable_consent_flow",
		}
		collection.Fields.Add(enableConsentFlowField)

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
		collection.AddIndex("idx_advertisement_configs_created", false, "created", "")
		collection.AddIndex("idx_advertisement_configs_experiment_id", false, "name", "")

		// Set access rules (only authenticated users can access)
		collection.ListRule = types.Pointer("@request.auth.id != ''")
		collection.ViewRule = types.Pointer("@request.auth.id != ''")
		collection.CreateRule = types.Pointer("@request.auth.id != ''")
		collection.UpdateRule = types.Pointer("@request.auth.id != ''")
		collection.DeleteRule = types.Pointer("@request.auth.id != ''")

		return app.Save(collection)
	}, func(app core.App) error {
		// remove configuration_templates collection
		collection, err := app.FindCollectionByNameOrId(advertisementConfigsCollectionName)
		if err != nil {
			return nil // collection doesn't exist, nothing to remove
		}

		return app.Delete(collection)
	})
}
