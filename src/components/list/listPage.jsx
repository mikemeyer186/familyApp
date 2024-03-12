import { useList } from '../../contexts/listContext';

import Spinner from '../global/spinner';
import ListContent from './listContent';

export default function ListPage() {
    const { isListLoaded } = useList();

    return <div className="listpage-wrapper">{!isListLoaded ? <Spinner>{'Listen laden...'}</Spinner> : <ListContent />}</div>;
}
