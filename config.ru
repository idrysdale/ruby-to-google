require_relative 'app'
require_relative 'my_assets'

unless ENV['RACK_ENV'] == 'production'
  map '/assets' do
    run MyAssets.environment Sinatra::Application.settings.root
  end
end

run Sinatra::Application
