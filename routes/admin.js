var express = require('express');
var path = require('path');
var fs = require('fs');
var passport = require('passport');
const bcrypt = require('bcryptjs');
const config = require('../config');
const jwt = require('jwt-simple');
const uniqueString = require('unique-string');
const shortid = require('shortid');
var mv = require('mv');
const fileUpload = require('express-fileupload');
const { check, validationResult } = require('express-validator');
const ConnectSequence = require('connect-sequence');
const formidable = require('express-formidable');
const {
  hasAdminAccess,
  superAdmin
} = require('../middleware/auth');
var async = require('async');
var router = express.Router();

// Middleware Modules
const validate = require('../middleware/validate');

const User = require('../models/users-model');
const Admin = require('../models/admin-model');
const Blog = require('../models/blog-model');
const Press = require('../models/press-model');
const Faq = require('../models/faq-model');
const NewsCategory = require('../models/news-category-model');
const HomeContent = require('../models/home-content-model');
const TermsCategory = require('../models/terms-condition-category-model');
const TermsCategoryContent = require('../models/terms-condition-item-model');
const MainSlider = require('../models/main-slider-model');
const PartnerSlider = require('../models/partner-slider-model');
const TeamSlider = require('../models/team-slider-model');
const Landlord = require('../models/for-landlord-model');
const Tenant = require('../models/for-tenant-model');
const Business = require('../models/for-business-model');
const OurValue = require('../models/our-value-model');
const StoryContactUs = require('../models/story-contact-us-model');
const SubScriber = require('../models/subscriber-model');
const FaqContent = require('../models/faq-content');
const BlogContent = require('../models/blog-content-model');
const GetStartedContent = require('../models/get-started-content');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



module.exports = router;
