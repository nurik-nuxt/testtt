module.exports = {
    apps: [
        {
            name: "nuxt-7sales",
            port: "3000",
            exec_mode: "fork",
            // exec_mode: "cluster",
            // env: {
            //   NODE_ENV: "production",
            //   BASE_URL: "https://api.7sales.ai",
            // },
            instances: 1,
            script: "./.output/server/index.mjs",

            // Logging
            out_file: "./out.log",
            error_file: "./error.log",
            merge_logs: true,
            log_date_format: "DD-MM HH:mm:ss Z",
        },
    ],
};