package settings

// TODO: Use Redis

type Settings struct {
	AutoUnarchive            bool
	MaxLength                int16
	OverrideRequirementAfter *int16
}

func New() *Settings {
	overrideRequirementAfter := int16(75)

	return &Settings{
		AutoUnarchive:            true,
		MaxLength:                150,
		OverrideRequirementAfter: &overrideRequirementAfter,
	}
}
