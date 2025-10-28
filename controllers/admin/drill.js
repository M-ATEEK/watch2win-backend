const drillsModel = require("../../models/drills-model");
const userModel = require("../../models/users-model");
const difficultyModel = require("../../models/difficultiesLevel-model");
const speedModel = require("../../models/speedLevel-model");

var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");
const fs = require("fs");
const { populate, watch } = require("../../models/drills-model");
const { compare } = require("bcryptjs");
const { select } = require("async");
const { use } = require("../../routes/admin/drills");

module.exports = {
	create: function (req, res, next) {
		if (!req.body.name) {
			res.status(200);
			res.json({
				success: false,
				errors: { email: { message: "name is required" } },
			});
		}
		let body = {
			name: req.body.name,
			thumbnail: req.body.thumbnail,
			athlete: req.body.athlete,
			category: req.body.category,
			difficultyLevel: req.body.difficultyLevel,
			isPremium: req.body.isPremium,
			videos: req.body.videos,
		};

		var newDrill = new drillsModel(body);
		newDrill.save(function (err) {
			if (err) {
				console.log("Error in saving new drill", err);
				res.status(200);
				return res.json({
					success: false,
					errors: errors,
					message: err.errmsg,
				});
			}
			res.json({
				success: true,
				data: {
					drills: newDrill,
					message: "drill with ID_${data._id} saved successfully!",
				},
			});
		});
	},
	videos: function (req, res, next) {
		let videos = {};
		if (req.files["thumbnail"] && req.files["thumbnail"].length > 0 && req.files["thumbnail"][0]) {
			videos.thumbnail = req.files["thumbnail"][0].filename;
		}
		if (req.files["video"] && req.files["video"].length > 0 && req.files["video"][0]) {
			videos.video = req.files["video"][0].filename;
		}
		res.json({
			success: true,
			data: {
				videos: videos,
				message: "video and thumbnails name!",
			},
		});
	},
	index: async function (req, res, next) {
		var _page = parseInt(req.query.page) || 1;
		var _limit = parseInt(req.query.limit) || 10;
		var skip = (_page - 1) * _limit;
		let drillsName = req.query.drillsName;
		let category_id = req.query.category_id;
		let athlete_id = req.query.athlete_id;
		let categoryName = req.query.categoryName;
		let athleteName = req.query.athleteName;
		if (categoryName) {
			drillsModel
				.find({})
				.populate({
					path: "athlete",
					model: "athlete",
				})
				.populate({
					path: "category",
					model: "categories",
					match: {
						name: { $regex: categoryName, $options: "$i" },
					},
				})
				.populate({
					path: "videos.speedLevel",
					model: "speedlevel",
				})
				.populate({
					path: "difficultyLevel",
					model: "difficultylevel",
				})
				.exec(function (err, data) {
					if (err) {
						res.send(err);
					} else {
						let category = data.filter((data, i) => {
							return data.category !== null;
						});
						res.send({
							message: "search by category name",
							data: {
								drills: category,
							},
						});
					}
				});
		} else if (athlete_id) {
			drillsModel
				.find({ athlete: { _id: athlete_id } })
				.populate({
					path: "athlete",
					model: "athlete",
				})
				.populate({
					path: "category",
					model: "categories",
				})
				.populate({
					path: "videos.speedLevel",
					model: "speedlevel",
				})
				.populate({
					path: "difficultyLevel",
					model: "difficultylevel",
				})
				.exec(function (err, data) {
					if (err) {
						res.send(err);
					} else {
						res.send({
							message: "search by athlete_id",
							data: {
								drills: data,
							},
						});
					}
				});
		} else if (athleteName) {
			drillsModel
				.find({})
				.populate({
					path: "athlete",
					model: "athlete",
					match: {
						name: { $regex: athleteName, $options: "$i" },
					},
				})
				.populate({
					path: "category",
					model: "categories",
				})
				.populate({
					path: "videos.speedLevel",
					model: "speedlevel",
				})
				.populate({
					path: "difficultyLevel",
					model: "difficultylevel",
				})
				.exec(function (err, data) {
					if (err) {
						res.send(err);
					} else {
						let athlete = data.filter((data, i) => {
							return data.athlete !== null;
						});
						res.send({
							message: "search by athlete name",
							data: {
								drills: athlete,
							},
						});
					}
				});
		} else if (category_id) {
			drillsModel
				.find({ category: { _id: category_id } })
				.populate({
					path: "athlete",
					model: "athlete",
				})
				.populate({
					path: "category",
					model: "categories",
				})
				.populate({
					path: "videos.speedLevel",
					model: "speedlevel",
				})
				.populate({
					path: "difficultyLevel",
					model: "difficultylevel",
				})
				.exec(function (err, data) {
					if (err) {
						res.send(err);
					} else {
						res.send({
							message: "search by category",
							data: {
								drills: data,
							},
						});
					}
				});
		} else if (drillsName === undefined) {
			const docCount = await drillsModel.countDocuments({});
			drillsModel
				.find({})
				.populate({
					path: "athlete",
					model: "athlete",
				})
				.populate({
					path: "category",
					model: "categories",
				})
				.populate({
					path: "videos.speedLevel",
					model: "speedlevel",
				})
				.populate({
					path: "difficultyLevel",
					model: "difficultylevel",
				})
				.skip(skip)
				.limit(_limit)
				.sort({ created_at: -1 })
				.exec(function (err, data) {
					if (err) {
						res.send(err);
					} else {
						res.send({
							count: docCount,
							message: "drills fetched successfully",
							data: {
								drills: data,
							},
						});
					}
				});
		} else if (drillsName) {
			drillsModel.find({ name: { $regex: drillsName, $options: "$i" } }, (err, data) => {
				if (err) {
					res.send(err);
				} else {
					res.send({
						message: "drills searched successfully",
						data: {
							drills: data,
						},
					});
				}
			});
		}
	},

	upsert: async function (req, res, next) {
		let id = req.params.id;
		let deletedfiles = req.body.deletedfiles;
		let body = {
			name: req.body.name,
			athlete: req.body.athlete,
			category: req.body.category,
			speedLevel: req.body.speedLevel,
			thumbnail: req.body.thumbnail,
			difficultyLevel: req.body.difficultyLevel,
			isPremium: req.body.isPremium,
			videos: req.body.videos,
		};

		if (deletedfiles && deletedfiles.length > 0) {
			deletedfiles.map((id) => {
				fs.unlink(`./public/drills/${id}`, (err) => {
					if (err) {
						console.log(err);
					} else {
						console.log("file delete");
					}
				});
			});
		}

		if (id == "new") {
			id = new ObjectId();
		} else {
			id = ObjectId(id);
		}
		drillsModel.updateOne({ _id: id }, body, { upsert: true }, (err, data) => {
			if (err) {
				res.sendStatus(500);
			} else {
				res.send({
					message: "success.",
					data: {
						drills: data,
					},
				});
			}
		});
	},
	delete: async function (req, res, next) {
		let id = req.params.id;
		drillsModel.findOne({ _id: ObjectId(id) }, {}, async (err, data) => {
			if (err) {
				res.sendStatus(500);
			} else if (data) {
				await data.remove();
				data.videos.map(async (video) => {
					await fs.unlink(`./public/drills/${video.video}`, (err) => {
						if (err) {
							console.log(err);
						} else {
							console.log("file delete");
						}
					});
					await fs.unlink(`./public/drills/${video.thumbnail}`, (err) => {
						if (err) {
							console.log(err);
						} else {
							console.log("file delete");
						}
					});
				});
				const docCount = await drillsModel.countDocuments({});
				res.send({
					message: "success.",
					data: {
						count: docCount,
						drills: data,
					},
				});
			} else {
				res.send({
					message: "Drill does not exist.",
				});
			}
		});
	},

	show: function (req, res, next) {
		let id = req.params.id;
		drillsModel
			.find({ _id: id }, function (err, user) { })
			.populate({
				path: "athlete",
				model: "athlete",
			})
			.populate({
				path: "category",
				model: "categories",
			})
			.populate({
				path: "videos.speedLevel",
				model: "speedlevel",
			})
			.populate({
				path: "difficultyLevel",
				model: "difficultylevel",
			})

			.exec(function (err, data) {
				if (err) {
					res.sendStatus(500);
				} else if (data) {
					res.send({
						message: "success.",
						data: {
							drills: data,
						},
					});
				} else {
					res.sendStatus(500);
				}
			});
	},
	points: async function (req, res, next) {
		let id = req.user._id
		var count = false
		let watchVideos = req.body.watchedVideos
		let { watchedVideos } = req.user
		let result = []
		let difficulty = await difficultyModel.findOne({ _id: watchVideos[0].diffculty_id });
		let speedLevel = await speedModel.findOne({ _id: watchVideos[0].speed_level_id })
		let pervideopoints = speedLevel.points / speedLevel.condition
		if (watchedVideos) {
			watchedVideos.map((data) => {
				if (data.video_id == watchVideos[0].video_id) {
					count = true
				}
			})
		}
		if (count) {
			check = watchedVideos.filter((data) => {
				return data.video_id == watchVideos[0].video_id
			})
			if (check[0].watch_count >= speedLevel.condition) {
				userModel.update(
					{
						_id: id,
						"watchedVideos.video_id": watchVideos[0].video_id
					},
					{ $inc: { 'watchedVideos.$.watch_count': 1 } },
					async (err, done) => {
						if (err) {
							return res.status(400).json({
								message: "something wrong"
							})
						}
						else {
							res.json({
								message: "you does not get points",
								user: done
							})
						}
					}
				)

			} else {
				userModel.update(
					{
						_id: id,
						"watchedVideos.video_id": watchVideos[0].video_id
					},
					{ $inc: { 'points': pervideopoints, 'watchedVideos.$.watch_count': 1 } },
					async (err, done) => {
						if (err) {
							return res.status(400).json({
								message: "something wrong"
							})
						}
						else {
							let user = await userModel.find({ _id: id })
							user.map(async function (data) {
								for (let i = 0; i < data.watchedVideos.length; i++) {
									if (data.watchedVideos[i].video_id === watchVideos[0].video_id) {
										result.push(data.watchedVideos[i]);
									}
								}

								if (result[0].watch_count == speedLevel.condition) {
									userModel.update(
										{
											_id: id
										},
										{ $inc: { 'points': difficulty.points } },
										{ new: true },
										(err, done) => {
											if (err) {

											}
											else {

											}
										}
									)
								}
							})
							res.json({
								success: true,
								data: {
									watchedVideos: done,
									message: "count increse"
								}
							});
						}

					}
				)
			}
		}
		else {
			userModel.update(
				{ _id: id },
				{ $push: { watchedVideos: watchVideos }, $inc: { 'points': pervideopoints } },
				(err, done) => {
					if (err) {

					}
					else {
						res.json({
							success: true,
							data: {
								drills: done,
								message: "watched video added to favorite"
							}
						});
					}
				}
			)
		}
	},
	totalLikes: function (req, res) {
		let drill_id = req.body.drill_id;
		let video_id = req.body.video_id;
		let isLike = req.body.isLike;
		if (isLike) {
			drillsModel.update({ _id: drill_id, "videos": { $elemMatch: { _id: video_id } } }, { $inc: { 'videos.$.totalLikes': 1 } }, function (err, like) {
				if (err) {
					res.sendStatus(500)
				}
				else {
					res.send({
						videoLikes: like
					})
				}

			})
		}
		else {
			drillsModel.update({ _id: drill_id, "videos": { $elemMatch: { _id: video_id } } }, { $inc: { 'videos.$.totalLikes': -1 } }, function (err, like) {
				if (err) {
					res.sendStatus(500)
				}
				else {
					res.send({
						videoLikes: like
					})
				}

			})
		}
	}
};
