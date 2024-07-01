const itineraries = require("../models/itineraries");

const itineraryController = {
  getItinerary: async (req, res) => {
    //console.log(req);
    const data = await itineraries.find();
    res.json({
      response: data,
    });
  },
  cargarCiudadItinerary: async (req, res) => {
    try {
      const itineraryPerCity = await itineraries
        .find({
          cityId: req.query.cityId,
        })
        .populate("activities")
        .populate("comments.userID", { fullName: 1, picture: 1 });
      res.json({ response: itineraryPerCity });
    } catch (error) {
      console.log(error);
    }
  },
  getOneItinerary: async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const data = await itineraries.findOne({ itineraryId: id });
    res.json({ response: data });
  },
  subirItinerary: (req, res) => {
    const {
      image,
      name,
      username,
      userimage,
      details,
      price,
      duration,
      hashtag,
      likes,
      comments,
      cityId,
    } = req.body;

    new itineraries({
      image,
      name,
      username,
      userimage,
      details,
      price,
      duration,
      hashtag,
      likes,
      comments,
      cityId,
    })
      .save()
      .then((respuesta) => res.json({ respuesta }));
  },

  borrarItinerary: async (req, res) => {
    const id = req.params.id;
    await itineraries
      .findOneAndDelete({ _id: id })
      .then((respuesta) => res.json({ respuesta }));
  },
  modificarItinerary: async (req, res) => {
    const id = req.params.id;
    const itinerary = req.body;

    await itineraries
      .findOneAndUpdate({ _id: id }, itinerary)
      .then((respuesta) => res.json({ respuesta }));
  },
  likeDislike: async (req, res) => {
    const id = req.params.id; //LLEGA POR AXIOS
    console.log(req.params.id);
    console.log(req.user);
    const user = req.user.id; //LLEGA POR PASSPORT
    try {
      await itineraries
        .findOne({ _id: req.params.id })
        .then((itinerary) => {
          console.log(itinerary);
          if (itinerary.likes.includes(user)) {
            itineraries
              .findOneAndUpdate(
                { _id: req.params.id },
                { $pull: { likes: user } },
                { new: true }
              ) //PULL QUITA, SACA
              .then((response) =>
                res.json({ success: true, response: response.likes })
              )
              .catch((error) => console.log(error));
          } else {
            itineraries
              .findOneAndUpdate(
                { _id: req.params.id },
                { $push: { likes: user } },
                { new: true }
              ) //PUSH AGREGA
              .then((response) =>
                res.json({ success: true, response: response.likes })
              )
              .catch((error) => console.log(error));
          }
        })
        .catch((error) => res.json({ success: false, response: error }));
    } catch (error) {
      res.json({ success: false, response: error.message });
    }
  },
  prueba: async (req, res) => {
    const data = await itineraries.find(); /* .populate("cityId") */
    res.json({
      response: data,
    });
  },
};
module.exports = itineraryController;
