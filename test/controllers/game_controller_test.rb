require "test_helper"

class GameControllerTest < ActionDispatch::IntegrationTest
  test "shows the game on root" do
    get root_url

    assert_response :success
    assert_select "h1", text: "ドラゴンクエストI風ミニRPG"
    assert_select "[data-dragon-quest-game]"
  end
end
