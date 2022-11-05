package store

import (
	"github.com/emonadeo/gdol/pkg/model"
)

func (store Store) Find() (model.List, error) {
	levels, err := store.Queries.ListFind(store.Ctx)
	if err != nil {
		return nil, err
	}

	list := model.List{}
	for _, v := range levels {
		list = append(list, model.ListLevel{
			Id:    int32(v.ID),
			GdId:  int32(v.GdID),
			Name:  v.Name,
			User:  v.User,
			Video: v.Video.String,
		})
	}

	return list, nil
}
