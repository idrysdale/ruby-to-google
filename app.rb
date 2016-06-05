require 'bundler'

Bundler.require :default

set :port, 8080
set :static, true
set :public_folder, 'static'
set :views, 'views'

get '/' do
  haml :register_form
end

post '/register' do
  email = params[:name]
  name = params[:email]

  hash = JSON.parse(File.read('./secrets.json'))

  session = GoogleDrive.saved_session('config.json')
  ws = session.spreadsheet_by_key(hash['spreadsheet_id']).worksheets[0]

  next_empty_row = ws.num_rows + 1

  ws[next_empty_row, 1] = email
  ws[next_empty_row, 2] = name
  ws.save
end
