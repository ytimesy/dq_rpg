ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"

module Rails
  module LineFiltering
    # Rails 7.2 defines this hook for Minitest 5, but our environment loads
    # Minitest 6 where Runnable.run receives a different signature.
    def run(*args, **kwargs)
      if args.length == 3
        super(*args, **kwargs)
      else
        reporter = args[0]
        options = args[1] || {}
        options = options.merge(filter: Rails::TestUnit::Runner.compose_filter(self, options[:filter]))

        super(reporter, options, *args.drop(2), **kwargs)
      end
    end
  end
end

module ActiveSupport
  class TestCase
    # Run tests in parallel with specified workers
    parallelize(workers: :number_of_processors)

    # Add more helper methods to be used by all tests here...
  end
end
