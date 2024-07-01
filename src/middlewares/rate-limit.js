const Bottleneck = require("bottleneck");
const { RateLimiting } = require("../utils/errors.js");

module.exports = function rateLimit() {
	return (req, res, next) => {
		const limiter = new Bottleneck({
			maxConcurrent: 100,
			minTime: 1000,
			heartbeatInterval: 5000,
		});

		limiter.schedule(
			{
				id: req.ip,
				priority: 5,
			},
			(err) => {
				if (err) {
					return next(new RateLimiting(429, "Too Many Requests. Be patient!"));
				}
			}
		);

		next();
	};
};
