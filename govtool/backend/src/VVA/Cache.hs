module VVA.Cache where

import           Control.Monad.IO.Class (MonadIO, liftIO)

import           Data.Aeson             (Value)
import qualified Data.Cache             as Cache
import           Data.Hashable          (Hashable)
import           Data.Text              (Text)


cacheRequest :: (Monad m, MonadIO m, Hashable k) => Cache.Cache k v -> k -> m v -> m v
cacheRequest cache key action = do
  maybeValue <- liftIO $ Cache.lookup cache key
  case maybeValue of
    Nothing -> do
      v <- action
      liftIO $ Cache.insert cache key v
      return v
    Just v -> return v
